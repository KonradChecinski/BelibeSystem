<?php

namespace App\Helpers\Barcodes;

use App\Models\Products\ProductBarcode;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class BarcodeGS1 implements IBarcode
{

    public static function generate(): ?ProductBarcode
    {
        $response = Http::withoutVerifying()->withBasicAuth(env('GS1_LOGIN'), env('GS1_PASSWORD'))
            ->get('https://mojegs1.pl/api/v2/products', [
                "sort" => "-gtin",
                "page[limit]" => 1,
                "page[offset]" => 1,
            ]);


        $barcode = substr($response->json()["data"][0]["id"], 0, -1);
        $barcode += 1;
        $barcode = (string)$barcode;

        $checksum = self::generateChecksum($barcode);
        $barcode = new ProductBarcode(["barcode" => $barcode . $checksum, "type" => 1]);

        return $barcode;
    }

    public static function save($barcode, $model, $product): Response
    {
        $description_b2b = $product->model->description_b2b;

        // zamiana tagów HTML na spację
        $description_b2b = preg_replace('/<[^>]*>/', ' ', $description_b2b);

        // zamiana twardych spacji i dziwnych whitespace na zwykłą spację
        $description_b2b = preg_replace('/\x{00A0}|\s+/u', ' ', $description_b2b);

        // usunięcie znaków specjalnych (np. emotki, ± itp.) – zostają litery, cyfry i podstawowa interpunkcja
        $description_b2b = preg_replace('/[^\p{L}\p{N}\s.,\-]/u', '', $description_b2b);

        // przycięcie długości
        $description_b2b = mb_substr(trim($description_b2b), 0, 4000);

        $response = Http::withoutVerifying()->withBasicAuth(env('GS1_LOGIN'), env('GS1_PASSWORD'))
            ->contentType("application/vnd.api+json")
            ->put('https://mojegs1.pl/api/v2/products/' . $barcode->barcode, [
                "data" => [
                    "type" => "products",
                    "id" => $barcode->barcode,
                    "attributes" => [
                        "brandName" => $model->gs1Brand->name,
                        "commonName" => $product->name,
                        "description" => $description_b2b,
                        "internalSymbol" => $product->symbol,
                        "descriptionLanguage" => "pl",
                        "gpcCode" => $model->gs1Gpc->value,
                        "netContent" => 1,
                        "netContentUnit" => $product->unit->name,
//                        "productImage" => null,
//                        "productWebsite" => null,
                        "status" => "ACT",
                        "subBrandName" => null,
                        "targetMarket" => [
                            "PL"
                        ],
//                        "variant" => ""
                    ]
                ]
            ]);


        return $response;

    }

    private static function generateChecksum($barcode): int
    {
        $suma = 0;
        for ($i = 0; $i < 12; $i++) {
            if ($i % 2 == 0) {
                $suma += $barcode[$i];
            } else {
                $suma += 3 * $barcode[$i];
            }

        }

        $reszta = $suma % 10;
        $reszta = 10 - $reszta;
        if ($reszta == 10) $reszta = 0;

        return $reszta;
    }

}
