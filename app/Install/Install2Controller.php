<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Models\B2cCategory;
use App\Models\B2cColor;
use App\Models\GS1Brand;
use App\Models\GS1GPC;
use App\Models\ProductBrand;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductSize;
use App\Models\Products\ProductUnit;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\ModelTw;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class Install2Controller extends Controller
{
    public function install()
    {
        //Modele
//        $modelsTw = ModelTw::limit(150)->offset(150)->get();
        $modelsTw = ModelTw::all()->sortBy(function ($item) {
            return substr($item->mdt_Nazwa, 7);
        });
        foreach ($modelsTw as $modelTw) {
//            dd($modelTw, $modelTw->towar);

            //Model
            $productModel = ProductModel::create([
                "symbol" => $modelTw->mdt_Nazwa,
                "name" => $modelTw->mdt_Nazwa,
                "description_b2b" => "",
                "description_b2c" => "",
                "description_allegro" => ""
            ]);


            //Kolory
            $colors = [];
            foreach ($modelTw->towar as $towar) {
                if (DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->count() == 0) continue;
                $colorTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->first()->pwd_Tekst02;
                $colorNazwaTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->first()->pwd_Tekst01;
                if (is_null($colorTw) || is_null($colorNazwaTw)) continue;
                $colors[$colorTw] = $colorNazwaTw;
            }
            foreach ($colors as $id => $color) {
                $productColor = new ProductModelColor([
                    'shortcut' => $id,
                    'name' => $color,
                ]);
                $productModel->colors()->save($productColor);
            }


            //Cena
            if ($modelTw->towar->count() == 0) {
                $productModel->prices()->create([
                    'vat_rate' => 23,
                    'wholesale_net_price' => 0,
                    'wholesale_gross_price' => 0,
                    'retail_net_price' => 0,
                    'retail_gross_price' => 0,
                ]);
            } else {
                $cena = Cena::findByProductId($modelTw->towar[0]->tw_Id);
                $productModel->prices()->create([
                    'vat_rate' => 23,
                    'wholesale_net_price' => $cena->tc_CenaNetto2 * 100,
                    'wholesale_gross_price' => $cena->tc_CenaBrutto2 * 100,
                    'retail_net_price' => $cena->tc_CenaNetto3 * 100,
                    'retail_gross_price' => $cena->tc_CenaBrutto3 * 100,
                ]);
            }


            //Subiekt
            $productModel->update([
                'name_6_char' => $modelTw->towar[0]->tw_Pole1,
                'name_11_char' => $modelTw->towar[0]->tw_Pole2,
            ]);

            if (DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $modelTw->towar[0]->tw_Id)->count() != 0) {
                $brandTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $modelTw->towar[0]->tw_Id)->first()->pwd_Tekst03;
                if (!is_null($brandTw)) {
                    $brand = ProductBrand::where("name", $brandTw)->first();
                    $productModel->brand()->associate($brand);
                }

                $categoryTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $modelTw->towar[0]->tw_Id)->first()->pwd_Fk02;
                if (!is_null($categoryTw)) {
                    $categoryP = DB::connection("subiekt")->table("sl_Wlasny")->where("sw_SlownikId", 10006)->where("sw_Id", $categoryTw)->first()->sw_Nazwa;
                    $category = B2cCategory::where("name", $categoryP)->first();
                    $productModel->b2cCategory()->associate($category);
                }
            }
            $productModel->group()->associate($modelTw->towar[0]->tw_IdGrupa);
            $productModel->save();


            //Produkty
            foreach ($modelTw->towar as $towar) {
                if (DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->count() == 0) continue;
                $colorTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->first()->pwd_Tekst02;
                $color = $productModel->colors()->where("shortcut", $colorTw)->first();
                if (is_null($color)) continue;

                $product = new Product([
                    "symbol" => $towar->tw_Symbol,
                    "name" => $towar->tw_Nazwa,
                    "subiekt_id" => $towar->tw_Id,
                    "show_in_subiekt" => !(bool)$towar->tw_Zablokowany
                ]);

                $sizeTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $towar->tw_Id)->first()->pwd_Tekst04;

                $size = ProductSize::where("name", $sizeTw)->first();
                if (is_null($sizeTw)) $size = ProductSize::find(28);
                $unit = ProductUnit::where("name", "szt")->first();

                $product->size()->associate($size);
                $product->unit()->associate($unit);
                $color->products()->save($product);

                $barcodes = [
                    $towar->tw_PodstKodKresk,
                ];
                foreach (DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_IdTowar", $towar->tw_Id)->get()->map(function ($e) {
                    return $e->kk_Kod;
                })->toArray() as $item) {
                    array_push($barcodes, $item);
                }

                foreach ($barcodes as $id => $barcodeValue) {
                    if (is_null($barcodeValue) || $barcodeValue == "" || $barcodeValue == " ") continue;

                    if (substr($barcodeValue, 0, 9) == "590185425" || substr($barcodeValue, 0, 8) == "59032053") {
                        $barcode = new ProductBarcode([
                            'barcode' => $barcodeValue,
                            'type' => 1,
                        ]);
                    } elseif ($barcodeValue >= 1000000000009 && $barcodeValue < 2000000000000) {
                        $barcode = new ProductBarcode([
                            'barcode' => $barcodeValue,
                            'type' => 2,
                        ]);
                    } else {
                        $barcode = new ProductBarcode([
                            'barcode' => $barcodeValue,
                            'type' => 3,
                        ]);
                    }

                    $barcode->main = $id == 0;
                    $barcode->product()->associate($product);
                    $barcode->save();
                }
            }
        }

        UpdateQuantityFromSubiekt::dispatch();
        return ("OK");
    }
}
