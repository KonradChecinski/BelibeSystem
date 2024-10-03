<?php

namespace App\Helpers\Empik;

use App\Models\ProductEmpikCategory;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Spatie\SimpleExcel\SimpleExcelWriter;

class Empik
{

    public static function login()
    {

    }

    public static function createProductsCsv(ProductModel $productModel)
    {
        $productsToEmpik = $productModel->products()->where("show_in_empik", 1)->get();

//        dd($productsToEmpik, $productModel, $productModel->empikCategory->name);

        $writer = SimpleExcelWriter::streamDownload("EmpikProducts.csv", delimiter: ';');

        foreach ($productsToEmpik as $productToEmpik) {
            $images = $productToEmpik->images()->where("type", 1)->get()->sortBy("order")->values();
            $images = $images->map(function ($image) {
                return str_replace("test", "pl", route("images.1x1", ["path" => $image->path]));
            });

            $writer->addRow([
                "STR_GOLD" => $productModel->empikCategory->name,//Kategoria Empik
                "CATALOG_CODE" => $productToEmpik->symbol,//Numer katalogowy
                "PELNY_TYTUL" => $productToEmpik->name_b2c,//Pełny tytuł
                "OPIS_PRODUKTU_PELNY" => $productModel->description_b2c,//Opis produktu;
                "EAN" => $productToEmpik->barcodes()->where("main", 1)->first()->barcode,//EAN
                "VAT_VALUE" => $productModel->prices->vat_rate . "%",//VAT

                "ZDJECIE_OKLADKI_PRZOD_DUZY" => $images[0] ?? "",//Zdjęcie Główne
                "DODATKOWE_ZDJECIA_1" => $images[1] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_2" => $images[2] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_3" => $images[3] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_4" => $images[4] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_5" => $images[5] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_6" => $images[6] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_7" => $images[7] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_8" => $images[8] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_9" => $images[9] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_10" => $images[10] ?? "",//Dodatkowe zdjęcia

                "600" => $productModel->brand->name,//Producent
                "34" => $productModel->brand->name,//Marka
                "2205" => $productToEmpik->size->name,//Rozmiar-wartość
                "2502" => $productToEmpik->size->name,//Rozmiar obuwia
                "254" => $productModel->clasp->value,//Zapięcie
            ]);


        }


        dd($writer->toBrowser());
    }


    public static function updateProducts()
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->post(config("services.empik.api_uri") . "/products/imports", [
                "file" => base64_encode(file_get_contents("EmpikProducts.csv")),
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik list offers error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function listAllProducts()
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/offers", [
                "max" => 100,
                //"offset"=>0,
                //"sort"=>"id",
                //"order"=>"asc",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik list offers error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function searchProduct(Product $product)
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/offers", [
                "sku" => $product->symbol,
//                "max" => 100,
                //"offset"=>0,
                //"sort"=>"id",
                //"order"=>"asc",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik search offer error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function updateOffers(Collection $products)
    {
        $offers = $products->map(function ($product) {
            return [
                "product_id" => $product->barcodes()->where("main", 1)->first()->barcode,
                "product_id_type" => "EAN",

                "shop_sku" => $product->symbol,
                "price" => (string)($product->model->prices->b2c_gross_price / 100),
                "quantity" => $product->available_b2c,

                "logistic_class" => "1", //1 - mała
                "leadtime_to_ship" => "1", //1 dzien realizacji
                "state_code" => "11",//nowe

//                "update_delete" => "update",// "update" or "delete".
            ];
        });


        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->post(config("services.empik.api_uri") . "/offers", [
                "offers" => $offers,
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik update/create offer error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json(), $offers);
        return $response;
    }


    public static function listOrders()
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/orders", [
                "sku" => $product->symbol,
//                "max" => 100,
                //"offset"=>0,
                //"sort"=>"id",
                //"order"=>"asc",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik search offer error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json());
        return $response;
    }
}
