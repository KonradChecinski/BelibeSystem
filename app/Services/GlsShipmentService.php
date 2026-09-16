<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Serwis biznesowy wyższego poziomu do obsługi procesów GLS.
 *
 * Korzysta z niskopoziomowego serwisu SOAP (GlsService) i hermetyzuje
 * logikę biznesową, taką jak:
 *  - logowanie / wylogowanie z sesji GLS
 *  - przygotowanie przesyłek wielopaczkowych (numeracja 1/N)
 *  - wyciąganie identyfikatorów przesyłek (consign_ids)
 *  - pobieranie etykiet w formacie PDF i zapisywanie ich w storage
 *  - weryfikacja kodów pocztowych oraz limitów COD
 */
class GlsShipmentService
{
    protected GlsService $gls;

    public function __construct(?GlsService $gls = null)
    {
        $this->gls = $gls ?? app(GlsService::class);
    }

    /**
     * Zwraca instancję bazowego serwisu SOAP GLS.
     */
    public function getGlsService(): GlsService
    {
        return $this->gls;
    }

    /**
     * Utwórz paczki w przygotowalni, pobierz etykietę i zapisz ją w storage.
     *
     * @param GlsConsignData $consignData
     * @param GlsParcel[] $parcels
     * @param string $labelMode
     * @return array
     * @throws Exception
     */
    public function createShipment(GlsConsignData $consignData, array $parcels): array
    {
        try {
            // 1) login
            $this->gls->login();

            // 2) dodanie referencji do paczek (numeracja 1/N, 2/N, ...)
            $totalParcels = count($parcels);
            foreach ($parcels as $id => $p) {
                $p->reference = ($id + 1) . "/" . $totalParcels;
            }

            $insertRes = $this->gls->preparingBoxInsertMany($consignData, $parcels);

            // 3) extract consign IDs from response
            $consignIds = $this->extractConsignIds($insertRes);

            if (empty($consignIds)) {
                // spróbuj pobrać listę z przygotowalni
                $idsRes = $this->gls->getPreparingConsignIDs();
                $consignIds = $this->extractConsignIds($idsRes);
            }

            if (empty($consignIds)) {
                $lastError = $this->gls->getLastError();
                throw new Exception('No consign IDs returned after insert. ' . ($lastError['message'] ?? ''));
            }


        } finally {
            // 6) logout
            try {
                $this->gls->logout();
            } catch (Exception $e) {
                // Ignorujemy błędy przy wylogowywaniu, aby nie przykryć głównego błędu
            }
        }

        return [
            'success' => true,
            'consign_id' => $consignIds[0] ?? null,
            'insert_response' => $this->normalizeResponse($insertRes),
        ];
    }

    public function getParcelIdFromShipment(int $shipmentExternalNumber)
    {
        try {
            // 1) login
            $this->gls->login();


            $consign = $this->gls->getPreparingBoxConsign($shipmentExternalNumber);


            if (empty($consign)) {
                $lastError = $this->gls->getLastError();
                throw new Exception('No consign returned after getPreparingBoxConsign. ' . ($lastError['message'] ?? ''));
            }
            $consign = $consign->return;


        } finally {
            // 6) logout
            try {
                $this->gls->logout();
            } catch (Exception $e) {
                // Ignorujemy błędy przy wylogowywaniu, aby nie przykryć głównego błędu
            }
        }

        return [
            'success' => true,
            'parcels_external_ids' => $consign->parcels->items ?? null,
            'insert_response' => $this->normalizeResponse($consign),
        ];
    }

    public function getLabelToShipment(int $shipmentExternalNumber, string $labelMode = 'roll_160x100_pdf')
    {
        try {
            // 1) login
            $this->gls->login();

            // 4) pobierz etykiety dla consign_id
            $labelRes = $this->gls->getPreparingConsignLabels($shipmentExternalNumber, $labelMode);

            // 5) spróbuj znaleźć dane base64 w odpowiedzi i zapisać plik w storage/app/couriers/labels
            $savedPath = $this->saveLabelFromResponse($labelRes, $shipmentExternalNumber);


        } finally {
            // 6) logout
            try {
                $this->gls->logout();
            } catch (Exception $e) {
                // Ignorujemy błędy przy wylogowywaniu, aby nie przykryć głównego błędu
            }
        }

        return $savedPath;


    }

    /**
     * Zapisuje etykietę PDF z odpowiedzi GLS do wskazanego dysku/katalogu w Storage.
     *
     * @param mixed $labelRes
     * @param string|int $consignId
     * @param string $disk
     * @param string $directory
     * @return string|null Pełna ścieżka do zapisanego pliku lub null jeśli brak base64
     */
    private function saveLabelFromResponse($labelRes, $consignId, string $directory = 'couriers/labels'): ?string
    {
        $base64 = $this->findBase64InResponse($labelRes);
        if (!$base64) {
            return null;
        }

        $bytes = base64_decode($base64);
        $filename = 'gls_label_' . date('Ymd_His') . '_' . Str::slug((string)$consignId) . '.pdf';
        $path = trim($directory, '/\\') . '/' . $filename;

        Storage::put($path, $bytes);

        return $path;
    }

    /**
     * Sprawdzenie maksymalnego COD i weryfikacja miasta po kodzie pocztowym.
     *
     * @param string $zip
     * @param string $country
     * @param string|null $service
     * @return array
     * @throws Exception
     */
    public function checkCodAndZip(string $zip, string $country, ?string $service = null): array
    {
        try {
            $this->gls->login();
            $codRes = $this->gls->getMaxCod($service);
            $city = $this->gls->zipGetCity($zip, $country);

            return [
                'success' => true,
                'max_cod_response' => $this->normalizeResponse($codRes),
                'city' => $city,
            ];
        } finally {
            try {
                $this->gls->logout();
            } catch (Exception $e) {
                // Ignorujemy błędy przy wylogowywaniu
            }
        }
    }

    /**
     * Wyciąga consign_id z odpowiedzi SOAP w kilku możliwych formatach.
     * Zwraca tablicę identyfikatorów (może być pusta).
     *
     * @param mixed $res
     * @return array
     */
    private function extractConsignIds($res): array
    {
        $ids = [];
        if (empty($res)) {
            return $ids;
        }

        // Normalizuj na tablicę przez json encode/decode aby łatwiej przeszukać
        $arr = json_decode(json_encode($res), true);
        // Przykładowe lokalizacje: ['return']['consign_id'], ['return']['consigns']['consign'][], ['return']['consigns_ids']
        if (isset($arr['return']['consign_id'])) {
            $ids[] = (string)$arr['return']['consign_id'];
        }
        if (isset($arr['return']['id'])) {
            $ids[] = (string)$arr['return']['id'];
        }
        if (isset($arr['return']['consigns'])) {
            $consigns = $arr['return']['consigns'];
            if (isset($consigns['consign'])) {
                $c = $consigns['consign'];
                if (isset($c[0])) {
                    foreach ($c as $item) {
                        if (isset($item['consign_id'])) {
                            $ids[] = (string)$item['consign_id'];
                        }
                    }
                } else {
                    if (isset($c['consign_id'])) {
                        $ids[] = (string)$c['consign_id'];
                    }
                }
            }
        }
        if (isset($arr['return']['consigns_ids'])) {
            $c = $arr['return']['consigns_ids'];
            if (isset($c['consign_id'])) {
                if (isset($c['consign_id'][0])) {
                    foreach ($c['consign_id'] as $cid) {
                        $ids[] = (string)$cid;
                    }
                } else {
                    $ids[] = (string)$c['consign_id'];
                }
            }
        }

        // Deduplikacja
        return array_values(array_unique($ids));
    }

    /**
     * Proste normalizowane mapowanie obiektu odpowiedzi do tablicy (bez dużych binarnych pól).
     *
     * @param mixed $res
     * @return mixed
     */
    private function normalizeResponse($res)
    {
        if (empty($res)) {
            return null;
        }
        $arr = json_decode(json_encode($res), true);
        // Usuń duże pola jeśli występują (np. raw label data)
        array_walk_recursive($arr, function (&$v) {
            if (is_string($v) && strlen($v) > 100000) {
                $v = '<<large binary data>>';
            }
        });
        return $arr;
    }

    /**
     * Rekurencyjnie przeszukuje odpowiedź SOAP w poszukiwaniu stringa wyglądającego na base64 PDF.
     *
     * @param mixed $res
     * @return string|null
     */
    private function findBase64InResponse($res): ?string
    {
        $arr = json_decode(json_encode($res), true);
        if (!is_array($arr)) {
            return null;
        }

        $iterator = new \RecursiveIteratorIterator(new \RecursiveArrayIterator($arr));
        foreach ($iterator as $val) {
            if (!is_string($val)) {
                continue;
            }
            $s = trim($val);
            // Prosty heurystyczny test: długość i dopuszczalne znaki base64
            if (strlen($s) > 200 && preg_match('/^[A-Za-z0-9\/+=\r\n]+$/', $s)) {
                // Dodatkowy test czy po dekodowaniu zaczyna się PDF
                $decoded = base64_decode($s, true);
                if ($decoded !== false && strpos($decoded, '%PDF') === 0) {
                    return $s;
                }
            }
        }
        return null;
    }
}
