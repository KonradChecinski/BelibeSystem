<?php

namespace App\Helpers\Empik;

use App\Models\ProductEmpikCategory;
use App\Models\Products\ProductModel;
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
//
//        $productToEmpik = $productsToEmpik[0];
//        $images = $productToEmpik->images()->where("type", 1)->get()->sortBy("order")->values();
//        $images = $images->map(function ($image) {
//            return route("images.1x1", ["path" => $image->path]);
//        });
//        foreach (ProductEmpikCategory::all() as $category) {
//
//
//            $writer->addRow([
//                "STR_GOLD" => $category->name,//Kategoria Empik
//                "CATALOG_CODE" => $productToEmpik->symbol,//Numer katalogowy
//                "PELNY_TYTUL" => $productToEmpik->name_b2c,//Pełny tytuł
//                "OPIS_PRODUKTU_PELNY" => $productModel->description_b2c,//Opis produktu;
//                "EAN" => $productToEmpik->barcodes()->where("main", 1)->first()->barcode,//EAN
//                "VAT_VALUE" => $productModel->prices->vat_rate . "%",//VAT
//
//                "ZDJECIE_OKLADKI_PRZOD_DUZY" => $images[0] ?? "",//Zdjęcie Główne
//                "DODATKOWE_ZDJECIA_1" => $images[1] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_2" => $images[2] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_3" => $images[3] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_4" => $images[4] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_5" => $images[5] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_6" => $images[6] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_7" => $images[7] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_8" => $images[8] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_9" => $images[9] ?? "",//Dodatkowe zdjęcia
//                "DODATKOWE_ZDJECIA_10" => $images[10] ?? "",//Dodatkowe zdjęcia
//
//                "600" => $productModel->brand->name,//Producent
//                "34" => $productModel->brand->name,//Marka
//                "2205" => $productToEmpik->size->name,//Rozmiar-wartość
//                "2502" => $productToEmpik->size->name,//Rozmiar obuwia
//                "254" => $productModel->clasp->value,//Zapięcie
//            ]);
//
//
//        }


        dd($writer->toBrowser());
    }
}
