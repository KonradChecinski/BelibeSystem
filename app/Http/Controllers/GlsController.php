<?php

namespace App\Http\Controllers;

use App\Services\GlsConsignData;
use App\Services\GlsParcel;
use App\Services\GlsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

/**
 * Przykładowy kontroler demonstrujący użycie GlsService.
 *
 * Metoda createParcels przyjmuje JSON z kluczem "parcels" (tablica paczek) lub używa przykładowych danych.
 * Przebieg:
 *  - logowanie (adeLogin)
 *  - wprowadzenie paczek do przygotowalni (InsertExt lub Insert)
 *  - pobranie etykiet dla pierwszego consign_id
 *  - zapis etykiety do storage/app/gls_labels
 *  - wylogowanie
 *
 * Odpowiedzi są zwracane jako JSON z pełnymi informacjami o błędach (jeżeli wystąpią).
 */
class GlsController extends Controller
{
    protected GlsService $gls;

    public function __construct(GlsService $gls)
    {
        $this->gls = $gls;
    }

    /**
     * Utwórz paczki w przygotowalni i pobierz etykiety (przykład)
     * @param GlsConsignData $consignData
     * @param GlsParcel[] $parcels
     * @param string $labelMode
     * @return \Illuminate\Http\JsonResponse
     */
    public function createParcels(GlsConsignData $consignData, array $parcels, string $labelMode = 'roll_160x100_pdf')
    {
        try {
            // 1) login
            $this->gls->login();

            // 2) dodanie referencji do paczek (numeracja 1/N, 2/N, ...)
            foreach ($parcels as $id => $p) {
                $p->reference = ($id + 1) . "/" . count($parcels);
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
                // brak consign_id - zwróć szczegóły odpowiedzi i lastError
                return response()->json([
                    'success' => false,
                    'message' => 'No consign IDs returned after insert',
                    'insert_response' => $this->normalizeResponse($insertRes),
                    'last_error' => $this->gls->getLastError(),
                ], 422);
            }

            // 4) pobierz etykiety dla pierwszego consign_id
            $consignId = $consignIds[0];
            $labelRes = $this->gls->getPreparingConsignLabels($consignId, $labelMode);
            // 5) spróbuj znaleźć dane base64 w odpowiedzi i zapisać plik tymczasowo w storage/app/temp
            $base64 = $this->findBase64InResponse($labelRes);
            $savedPath = null;


            if ($base64) {
                $bytes = base64_decode($base64);
                $filename = 'gls_label_' . date('Ymd_His') . '_' . Str::slug($consignId) . '.pdf';
                $tempPath = 'temp/' . $filename;
                // zapisujemy do Storage (disk local)
                \Storage::disk('local')->put($tempPath, $bytes);
                // pełna ścieżka do pliku
                $savedPath = \Storage::disk('local')->path($tempPath);
            }

            // 6) logout
            $this->gls->logout();

            return response()->json([
                'success' => true,
                'consign_ids' => $consignIds,
                'label_saved_path' => $savedPath,
                'insert_response' => $this->normalizeResponse($insertRes),
                'label_response' => $this->normalizeResponse($labelRes),
            ]);
        } catch (Exception $e) {
            // Zbieramy szczegóły błędu z serwisu (jeśli są)
            $last = $this->gls->getLastError();
            $payload = [
                'success' => false,
                'exception' => $e->getMessage(),
                'last_error' => $last,
            ];
            return response()->json($payload, 422);
        }
    }

    /**
     * Przykładowa metoda pokazująca sprawdzenie maksymalnego COD i walidację miasta po kodzie pocztowym
     */
    public function checkCodAndZip(Request $request)
    {
        $zip = $request->input('zip', '00-001');
        $country = $request->input('', 'PL');
        $service = $request->input('service', null);

        try {
            $this->gls->login();
            $codRes = $this->gls->getMaxCod($service);
            $city = $this->gls->zipGetCity($zip, $country);
            $this->gls->logout();

            return response()->json([
                'success' => true,
                'max_cod_response' => $this->normalizeResponse($codRes),
                'city' => $city,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'exception' => $e->getMessage(),
                'last_error' => $this->gls->getLastError(),
            ], 422);
        }
    }

    /**
     * Wyciąga consign_id z odpowiedzi SOAP w kilku możliwych formatach.
     * Zwraca tablicę identyfikatorów (może być pusta).
     */
    protected function extractConsignIds($res): array
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
                        if (isset($item['consign_id'])) $ids[] = (string)$item['consign_id'];
                    }
                } else {
                    if (isset($c['consign_id'])) $ids[] = (string)$c['consign_id'];
                }
            }
        }
        if (isset($arr['return']['consigns_ids'])) {
            $c = $arr['return']['consigns_ids'];
            if (isset($c['consign_id'])) {
                if (isset($c['consign_id'][0])) {
                    foreach ($c['consign_id'] as $cid) $ids[] = (string)$cid;
                } else {
                    $ids[] = (string)$c['consign_id'];
                }
            }
        }

        // Deduplikacja
        $ids = array_values(array_unique($ids));
        return $ids;
    }

    /**
     * Proste normalizowane mapowanie obiektu odpowiedzi do tablicy (bez dużych binarnych pól)
     */
    protected function normalizeResponse($res)
    {
        if (empty($res)) return null;
        $arr = json_decode(json_encode($res), true);
        // Usuń duże pola jeśli występują (np. raw label data)
        array_walk_recursive($arr, function (&$v, $k) {
            if (is_string($v) && strlen($v) > 100000) {
                $v = '<<large binary data>>';
            }
        });
        return $arr;
    }

    /**
     * Rekurencyjnie przeszukuje odpowiedź SOAP w poszukiwaniu stringa wyglądającego na base64 PDF
     */
    protected function findBase64InResponse($res): ?string
    {
        $arr = json_decode(json_encode($res), true);
        $found = null;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveArrayIterator($arr));
        foreach ($iterator as $val) {
            if (!is_string($val)) continue;
            $s = trim($val);
            // prosty heurystyczny test: długość i dopuszczalne znaki base64
            if (strlen($s) > 200 && preg_match('/^[A-Za-z0-9\/+=\r\n]+$/', $s)) {
                // dodatkowy test czy po dekodowaniu zaczyna się PDF
                $decoded = base64_decode($s, true);
                if ($decoded !== false && strpos($decoded, '%PDF') === 0) {
                    $found = $s;
                    break;
                }
            }
        }
        return $found;
    }
}
