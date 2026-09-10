<?php

namespace App\Services;

use SoapClient;
use SoapFault;
use Exception;
use InvalidArgumentException;

/**
 * Serwis do komunikacji z WebAPI GLS przez SOAP.
 *
 * Implementuje logowanie/wylogowanie oraz podstawowy flow: wprowadzenie paczek do przygotowalni,
 * wygenerowanie potwierdzenia nadania (pickup) i pobranie etykiet.
 *
 * Komentarze po polsku — pola requestów należy dostosować do szczegółów z dokumentacji GLS.
 */
class GlsService
{
    protected SoapClient $client;
    protected array $config;
    protected ?string $session = null; // przechowuje identyfikator sesji po zalogowaniu

    // Dostępne tryby etykiet wg dokumentacji
    public const LABEL_MODES = ['roll_160x100_pdf', 'roll_160x100_vertical_pdf', 'one_label_on_a4_lt_pdf'];

    // Ostatni błąd (z ostatniego wywołania) w postaci ['code'=>..., 'message'=>..., 'detail'=>...]
    protected ?array $lastError = null;

    /**
     * Wyczyść ostatni błąd
     */
    public function clearLastError(): void
    {
        $this->lastError = null;
    }

    /**
     * Ustaw lastError z dowolnej struktury
     */
    protected function setLastError(array $err): void
    {
        $this->lastError = $err;
    }

    /**
     * Ustaw lastError na podstawie SoapFault
     */
    protected function setLastErrorFromFault(SoapFault $fault, string $method = ''): void
    {
        $this->lastError = [
            'code' => $fault->faultcode ?? 'soap_fault',
            'message' => $fault->faultstring ?? 'Unknown SOAP fault',
            'method' => $method,
            'detail' => property_exists($fault, 'detail') ? $fault->detail : null,
        ];
    }

    /**
     * Pobierz ostatni błąd (do wyświetlenia użytkownikowi)
     */
    public function getLastError(): ?array
    {
        return $this->lastError;
    }

    /**
     * @throws SoapFault
     */
    public function __construct()
    {
        $this->config = config('gls');

        $wsdl = $this->config['wsdl'];
        $options = $this->config['options'] ?? [];

        // Wstawienie kredencjałów do opcji (jeżeli serwis wymaga HTTP auth)
        if (!empty($this->config['user'])) {
            $options['login'] = $this->config['user'];
        }
        if (!empty($this->config['password'])) {
            $options['password'] = $this->config['password'];
        }

        $this->client = new SoapClient($wsdl, $options);
    }

    /**
     * Genericzny wrapper do wywołań SOAP.
     * Automatycznie dołącza `session` jeśli jest ustawione (poza metodami logowania).
     * @param string $method
     * @param array $params
     * @return mixed
     * @throws Exception
     */
    public function call(string $method, array $params = [], bool $dd = false)
    {
        // Zerowanie błędu poprzedniego zapytania
        $this->clearLastError();

        try {
            // Jeśli mamy już zalogowaną sesję, dołącz ją do parametrów większości metod
            if ($this->session && !isset($params['session']) && !in_array($method, ['adeLogin', 'adeLoginIntegrator', 'adeLoginByLocalizationCode'])) {
                $params = array_merge(['session' => $this->session], $params);
            }
            if ($dd) {
                dd($params);
            }
            return $this->client->__soapCall($method, [$params]);
        } catch (SoapFault $fault) {
            // zapisujemy szczegóły błędu do lastError
            $this->setLastErrorFromFault($fault, $method);

            $code = $fault->faultcode ?? 'soap_fault';
            $msg = $fault->faultstring ?? 'Unknown SOAP fault';

            // Kilka specyficznych komunikatów można obsłużyć inaczej jeśli potrzeba
            switch ($code) {
                case 'err_zipcode_not_found':
                    throw new Exception("ZIP code not found: {$msg}", 404, $fault);
                case 'err_sess_not_found':
                case 'err_sess_expired':
                    // Wymuś ponowne zalogowanie przy kolejnych próbach
                    $this->session = null;
                    throw new Exception("Session error ({$code}): {$msg}", 401, $fault);
                case 'err_user_incorrect_username_password':
                    throw new Exception("Authentication failed: {$msg}", 401, $fault);
                default:
                    throw new Exception("GLS SOAP fault ({$method}): {$code} - {$msg}", 500, $fault);
            }
        } catch (Exception $e) {
            // zapisujemy ogólny błąd
            $this->setLastError(['code' => 'exception', 'message' => $e->getMessage()]);
            throw new Exception("GLS SOAP call failed ({$method}): {$e->getMessage()}", $e->getCode(), $e);
        }
    }

    /**
     * Zaloguj się do systemu GLS (adeLogin). Ustawia wewnętrzne $session.
     * @return string session id
     * @throws Exception
     */
    public function login(): string
    {
        // reset previous error
        $this->clearLastError();

        $user = $this->config['user'] ?? null;
        $password = $this->config['password'] ?? null;

        if (empty($user) || empty($password)) {
            $this->setLastError(['code' => 'config', 'message' => 'GLS credentials are not configured (GLS_USER/GLS_PASSWORD).']);
            throw new Exception('GLS credentials are not configured (GLS_USER/GLS_PASSWORD).');
        }

        $params = [
            'user_name' => $user,
            'user_password' => $password,
        ];

        $res = $this->call('adeLogin', $params);

        // oczekujemy $res->return->session
        if (isset($res->return->session)) {
            $this->session = (string)$res->return->session;
            return $this->session;
        }

        $this->setLastError(['code' => 'no_session', 'message' => 'Unable to obtain GLS session from adeLogin response.']);
        throw new Exception('Unable to obtain GLS session from adeLogin response.');
    }

    /**
     * Wyloguj się z systemu (adeLogout) i wyczyść sesję lokalnie.
     * @return mixed
     * @throws Exception
     */
    public function logout()
    {
        $this->clearLastError();

        if (empty($this->session)) {
            return null; // nic do wylogowania
        }

        $params = ['session' => $this->session];
        $res = $this->call('adeLogout', $params);
        $this->session = null;
        return $res;
    }

    /**
     * Ensure there is an active session; if not, perform login.
     * @return string session
     */
    protected function ensureLoggedIn(): string
    {
        if (empty($this->session)) {
            return $this->login();
        }
        return $this->session;
    }

    /**
     * Walidacja podstawowych pól paczki kurierskiej.
     * Rzuca InvalidArgumentException jeśli wymagane pole nie jest poprawne.
     * Nie waliduje wszystkich możliwych pól API, tylko te krytyczne.
     * @param array $parcel
     */
    protected function validateParcel(array $parcel): void
    {
        if (empty($parcel['weight']) || !is_numeric($parcel['weight'])) {
            throw new InvalidArgumentException('Parcel weight is required and must be numeric.');
        }
        $weight = (float)$parcel['weight'];
        if ($weight < 0.01) {
            throw new InvalidArgumentException('Parcel weight must be at least 0.01 kg.');
        }

        $required = ['receiver_name', 'receiver_street', 'receiver_zip', 'receiver_city', 'receiver_country'];
        foreach ($required as $k) {
            if (empty($parcel[$k])) {
                throw new InvalidArgumentException("Parcel missing required field: {$k}");
            }
        }

        // Jeśli istnieje COD, basic validation
        if (!empty($parcel['COD'])) {
            $cod = $parcel['COD'];
            if (empty($cod['amount']) || !is_numeric($cod['amount'])) {
                throw new InvalidArgumentException('COD amount must be provided and numeric when COD is used.');
            }
        }
    }

    /**
     * Walidacja minimalna dla elementu parcel używanego w consign.parcels.items
     */
    protected function validateParcelItem(array $parcel): void
    {
        if (empty($parcel['weight']) || !is_numeric($parcel['weight'])) {
            throw new InvalidArgumentException('Parcel weight is required and must be numeric.');
        }
        $weight = (float)$parcel['weight'];
        if ($weight < 0.01) {
            throw new InvalidArgumentException('Parcel weight must be at least 0.01 kg.');
        }

        // W GLS COD ustawiamy na poziomie przesyłki (consign), nie na poziomie pojedynczej paczki.
        if (array_key_exists('COD', $parcel)) {
            throw new InvalidArgumentException('COD must be provided on the consign level (ConsignExt), not per parcel.');
        }
    }

    /**
     * Wprowadź jedną paczkę do przygotowalni (adePreparingBox_Insert).
     * $parcelData - struktura Parcel zgodna z dokumentacją GLS.
     * Jeśli klient ma już ustawionego nadawcę na koncie GLS, nie trzeba przesyłać danych nadawcy.
     * @param array $parcelData
     * @return mixed
     */
    public function preparingBoxInsert(array $parcelData)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        // walidacja lokalna przed wysłaniem
        try {
            $this->validateParcel($parcelData);
        } catch (InvalidArgumentException $ve) {
            $this->setLastError(['code' => 'validation', 'message' => $ve->getMessage()]);
            throw $ve;
        }

        $params = ['parcel' => $parcelData];
        return $this->call('adePreparingBox_Insert', $params);
    }

    /**
     * Wprowadź wiele paczek do przygotowalni (adePreparingBox_InsertExt lub wielokrotne wywołanie Insert).
     * Przyjmuje listę paczek (array of parcel arrays). Dla 3 paczek przesyłka powinna wygladać jak wyżej.
     * @param GlsConsignData $consignData
     * @param GlsParcel[] $parcels
     * @return mixed
     */
    public function preparingBoxInsertMany(GlsConsignData $consignData, array $parcels)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();


        // Walidacja i konwersja parcels -> GlsParcel (DTO) — GlsParcel rzuca błędy walidacji gdy trzeba
        $parcelObjs = [];
        foreach ($parcels as $idx => $p) {
            try {
                if ($p instanceof GlsParcel) {
                    $parcelObjs[] = $p;
                } else {
                    $parcelObjs[] = new GlsParcel(is_array($p) ? $p : []);
                }
            } catch (InvalidArgumentException $e) {
                $this->setLastError(['code' => 'validation', 'message' => "Parcel {$idx}: " . $e->getMessage()]);
                throw $e;
            }
        }

        // Budujemy strukturę ConsignExt: odbiorca na poziomie przesyłki, parcels.items lista paczek
        $consign = $consignData->toGLSArray();

        $items = [];
        foreach ($parcels as $p) {
            $item = [];
            if (isset($p->weight)) $item['weight'] = $p->weight;
            if (isset($p->reference)) $item['reference'] = $p->reference;
            $items[] = $item;
        }

        $consign['parcels'] = ['items' => $items];

        // Sprawdzenie limitów: maksymalna waga paczki oraz maksymalne COD
        $maxWeight = null;
        try {
            $maxWeightRes = $this->getMaxParcelWeights();
            $maxWeight = $this->extractNumericFromReturn($maxWeightRes->return ?? $maxWeightRes);
        } catch (Exception $e) {
            $this->setLastError(['code' => 'warn_limits_unavailable', 'message' => 'Unable to fetch parcel weight limits: ' . $e->getMessage()]);
        }

        $maxCod = null;
        try {
            $maxCodRes = $this->getMaxCod();
            $maxCod = $this->extractNumericFromReturn($maxCodRes->return ?? $maxCodRes);
        } catch (Exception $e) {
            $this->setLastError(['code' => 'warn_limits_unavailable', 'message' => 'Unable to fetch COD limits: ' . $e->getMessage()]);
        }

        // Waliduj limity dla każdej paczki wejściowej (waga) — używamy obiektów GlsParcel
        foreach ($parcelObjs as $idx => $pObj) {
            $w = $pObj->weight;
            if ($maxWeight !== null && $w > $maxWeight) {
                $this->setLastError(['code' => 'limit_weight_exceeded', 'message' => "Parcel #{$idx} weight {$w} exceeds max allowed {$maxWeight}"]);
                throw new InvalidArgumentException("Parcel weight exceeds maximum allowed ({$maxWeight} kg) for parcel index {$idx}");
            }
        }

        // Sprawdź czy consignDto zawiera informacje o COD (DTO ma metodę getCodAmountFloat)
        $hasCod = false;
        $totalCod = 0.0;

        // Jeśli DTO ma COD (int cents)
        if ($consignData->COD !== null) {
            $hasCod = true;
            $totalCod = $consignData->getCodAmountFloat();
        }


        if ($hasCod) {
            if ($maxCod !== null && $totalCod > $maxCod) {
                $this->setLastError(['code' => 'limit_cod_exceeded', 'message' => "Total COD amount {$totalCod} exceeds max allowed {$maxCod}"]);
                throw new InvalidArgumentException("Total COD amount exceeds maximum allowed ({$maxCod})");
            }
        }

        // Zgodnie z dokumentacją metoda oczekuje pola 'consign_prep_data' zawierającego ConsignExt
        $params = ['consign_prep_data' => $consign];

        try {
            return $this->call('adePreparingBox_InsertExt', $params);
        } catch (Exception $e) {
            $this->setLastError(['code' => 'validation', 'message' => 'Error during preparingBoxInsertExt: ' . $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Sprawdź maksymalną wartość COD dla użytkownika/usługi (adeServices_GetMaxCOD).
     * Parametr service (opcjonalny) może określać typ usługi.
     * @param string|null $service
     * @return mixed
     */
    public function getMaxCod(?string $service = null)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        $params = [];
        if ($service !== null) {
            $params['service'] = $service;
        }
        return $this->call('adeServices_GetMaxCOD', $params);
    }

    /**
     * Sprawdź maksymalne dopuszczalne wagi paczek dla użytkownika/usługi (adeServices_GetMaxParcelWeights).
     * Zwraca strukturę z informacją o maksymalnej wadze paczki. Kształt odpowiedzi zależy od GLS,
     * więc pomocniczo udostępniamy extractNumericFromReturn aby wyciągnąć wartość liczbową.
     * @param string|null $service
     * @return mixed
     */
    public function getMaxParcelWeights(?string $service = null)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        $params = [];
        if ($service !== null) {
            $params['service'] = $service;
        }
        return $this->call('adeServices_GetMaxParcelWeights', $params);
    }

    /**
     * Sprawdź miasto po kodzie pocztowym (adeZip_GetCity) — przydatne do walidacji pary ZIP/City.
     * Wymagane parametry: session (dołączane automatycznie), country (ISO2) i zipcode.
     * @param string $zipcode
     * @param string $country ISO 2-letter country code (default 'PL')
     * @return mixed|null  Zwraca obiekt z polem city w przypadku znalezienia, null gdy err_zipcode_not_found
     * @throws Exception
     */
    public function zipGetCity(string $zipcode, string $country = 'PL')
    {
        $this->clearLastError();
        $this->ensureLoggedIn();

        if (empty($country) || strlen($country) !== 2) {
            $this->setLastError(['code' => 'validation', 'message' => 'Country must be ISO 2-letter code.']);
            throw new InvalidArgumentException('Country must be ISO 2-letter code.');
        }

        $params = ['country' => strtoupper($country), 'zipcode' => $zipcode];
        try {
            $res = $this->call('adeZip_GetCity', $params);
            return $res->return->city ?? null;
        } catch (Exception $e) {
            // Jeśli call rzucił wyjątek 404 (ZIP not found), zwróć null, inne błędy przekaż dalej
            if ($e->getCode() === 404 || str_contains($e->getMessage(), 'ZIP code not found')) {
                return null;
            }
            throw $e;
        }
    }

    /**
     * Pobierz identyfikatory przesyłek znajdujących się w przygotowalni (adePreparingBox_GetConsignIDs)
     * @return mixed
     */
    public function getPreparingConsignIDs()
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        return $this->call('adePreparingBox_GetConsignIDs', []);
    }

    /**
     * Pobierz szczegóły pojedynczej przesyłki z przygotowalni (adePreparingBox_GetConsign)
     * @param string|int $consignId
     * @return mixed
     */
    public function getPreparingConsign($consignId)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($consignId)) {
            $this->setLastError(['code' => 'validation', 'message' => 'consignId is required']);
            throw new InvalidArgumentException('consignId is required');
        }
        $params = ['consign_id' => $consignId];
        return $this->call('adePreparingBox_GetConsign', $params);
    }

    /**
     * Pobierz etykiety dla przesyłki z przygotowalni - spowoduje nadanie numeru paczki jeśli go nie ma
     * (adePreparingBox_GetConsignLabels). Mode może być: 'roll_160x100_pdf', 'roll_160x100_vertical_pdf', 'one_label_on_a4_lt_pdf'
     * @param string|int $consignId
     * @param string $mode
     * @return mixed
     */
    public function getPreparingConsignLabels($consignId, string $mode = 'one_label_on_a4_lt_pdf')
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($consignId)) {
            $this->setLastError(['code' => 'validation', 'message' => 'consignId is required']);
            throw new InvalidArgumentException('consignId is required');
        }
        if (!in_array($mode, self::LABEL_MODES)) {
            $this->setLastError(['code' => 'validation', 'message' => 'Invalid label mode. Allowed: ' . implode(', ', self::LABEL_MODES)]);
            throw new InvalidArgumentException('Invalid label mode. Allowed: ' . implode(', ', self::LABEL_MODES));
        }
        $params = ['id' => $consignId, 'mode' => $mode];
        return $this->call('adePreparingBox_GetConsignLabels', $params);
    }

    /**
     * Usuń przesyłkę z przygotowalni (adePreparingBox_DeleteConsign).
     * UWAGA: Usunięcie przesyłki, która już ma nadane numery, powoduje utratę puli numerów.
     * @param string|int $consignId
     * @return mixed
     */
    public function deletePreparingConsign($consignId)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($consignId)) {
            $this->setLastError(['code' => 'validation', 'message' => 'consignId is required']);
            throw new InvalidArgumentException('consignId is required');
        }
        $params = ['consign_id' => $consignId];
        return $this->call('adePreparingBox_DeleteConsign', $params);
    }

    /**
     * Potwierdź nadanie (utwórz Pickup) z przesyłek z przygotowalni (adePickup_Create).
     * $pickupData - struktura Pickup zgodna z dokumentacją; najczęściej lista consign_id lub parametry potwierdzenia.
     * @param array $pickupData
     * @return mixed
     */
    public function createPickup(array $pickupData)
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($pickupData)) {
            $this->setLastError(['code' => 'validation', 'message' => 'pickupData is required']);
            throw new InvalidArgumentException('pickupData is required');
        }
        return $this->call('adePickup_Create', $pickupData);
    }

    /**
     * Pobierz listę identyfikatorów potwierdzeń nadania (adePickup_GetIDs).
     * @return mixed
     */
    public function getPickupIDs()
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        return $this->call('adePickup_GetIDs', []);
    }

    /**
     * Pobierz Potwierdzenie nadania (druk) w jednym z trybów: with_barcodes, condensed, condensed_description_of_pickup
     * (adePickup_GetReceipt)
     * @param string|int $pickupId
     * @param string $mode
     * @return mixed
     */
    public function getPickupReceipt($pickupId, string $mode = 'with_barcodes')
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($pickupId)) {
            $this->setLastError(['code' => 'validation', 'message' => 'pickupId is required']);
            throw new InvalidArgumentException('pickupId is required');
        }
        $allowed = ['with_barcodes', 'condensed', 'condensed_description_of_pickup'];
        if (!in_array($mode, $allowed)) {
            $this->setLastError(['code' => 'validation', 'message' => 'Invalid pickup receipt mode. Allowed: ' . implode(', ', $allowed)]);
            throw new InvalidArgumentException('Invalid pickup receipt mode. Allowed: ' . implode(', ', $allowed));
        }
        $params = ['pickup_id' => $pickupId, 'mode' => $mode];
        return $this->call('adePickup_GetReceipt', $params);
    }

    /**
     * Pobierz etykietę pojedynczej paczki po numerze paczki (adePickup_GetParcelLabel)
     * (alias do calla)
     * @param string $parcelNumber
     * @param string $format
     * @return mixed
     */
    public function getParcelLabel($parcelNumber, $format = 'PDF')
    {
        $this->clearLastError();
        $this->ensureLoggedIn();
        if (empty($parcelNumber)) {
            $this->setLastError(['code' => 'validation', 'message' => 'parcelNumber is required']);
            throw new InvalidArgumentException('parcelNumber is required');
        }
        $params = ['parcelNumber' => $parcelNumber, 'format' => $format];
        return $this->call('adePickup_GetParcelLabel', $params);
    }

    /**
     * Pomocnik: wyciąga pierwszą wartość liczbową z odpowiedzi SOAP (przydatne do getMax*).
     * Zwraca null gdy nie uda się odnaleźć wartości.
     */
    protected function extractNumericFromReturn($ret): ?float
    {
        if ($ret === null) return null;
        if (is_numeric($ret)) return (float)$ret;
        if (is_object($ret) || is_array($ret)) {
            foreach ((array)$ret as $v) {
                if (is_numeric($v)) return (float)$v;
                if (is_object($v) || is_array($v)) {
                    $res = $this->extractNumericFromReturn($v);
                    if ($res !== null) return $res;
                }
            }
        }
        return null;
    }

    /**
     * Helper: struktura auth (zostawiona do użytku jeśli potrzebne przez konkretne funkcje)
     * @return array
     */
    protected function getAuth(): array
    {
        return [
            'user' => $this->config['user'] ?? null,
            'password' => $this->config['password'] ?? null,
            'test' => $this->config['test_mode'] ?? true,
        ];
    }
}
