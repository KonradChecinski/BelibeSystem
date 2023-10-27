<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
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

class InstallController extends Controller
{
    public function install()
    {
        User::create([
            'name' => "Administrator",
            'email' => "admin@admin.pl",
            "email_verified_at" => "01.01.2022",
            'password' => Hash::make("Password"),
        ]);

        Artisan::call("db:seed");

        //Rozmiary
        $sizes = DB::connection("subiekt")->table("sl_Wlasny")->where("sw_SlownikId", 10003)->get();
        foreach ($sizes as $size) {
            ProductSize::create([
                'name' => $size->sw_Nazwa
            ]);
        }


        //Jednostki
        ProductUnit::create([
            'name' => "szt"
        ]);
        ProductUnit::create([
            'name' => "opak"
        ]);


        //Grupy
        $groups = DB::connection("subiekt")->table("sl_GrupaTw")->get();
        foreach ($groups as $group) {
            ProductGroup::create([
                "id" => $group->grt_Id,
                'name' => $group->grt_Nazwa
            ]);
        }

        //Marki
        $brands = DB::connection("subiekt")->table("sl_Wlasny")->where("sw_SlownikId", 10007)->get();
        foreach ($brands as $brand) {
            ProductBrand::create([
                'name' => $brand->sw_Nazwa
            ]);
        }

        //Marki GS1
        GS1Brand::create([
            'name' => "SPIN"
        ]);
        GS1Brand::create([
            'name' => "Belibe Sport"
        ]);


        //GPC GS1
        GS1GPC::create([
            'name' => "Strój kąpielowy - góra",
            "value" => 10008065
        ]);
        GS1GPC::create([
            'name' => "Strój kąpielowy - dół",
            "value" => 10008066
        ]);
        GS1GPC::create([
            'name' => "Strój kąpielowy - jednoczęściowy",
            "value" => 10008067
        ]);
        GS1GPC::create([
            'name' => "Strój kąpielowy - dwuczęściowy",
            "value" => 10008068
        ]);
        GS1GPC::create([
            'name' => "Stroje kąpielowe - inne",
            "value" => 10006965
        ]);
        GS1GPC::create([
            'name' => "Stroje plażowe/okrycia",
            "value" => 10006964
        ]);


        //Kategorie B2C
        $categories = DB::connection("subiekt")->table("sl_Wlasny")->where("sw_SlownikId", 10006)->get();
        foreach ($categories as $category) {
            B2cCategory::create([
                'id' => $category->sw_Id,
                'name' => $category->sw_Nazwa
            ]);
        }


        //Kolory B2C
        $colors = DB::connection("subiekt")->table("sl_Wlasny")->where("sw_SlownikId", 10014)->get();
        foreach ($colors as $color) {
            B2cColor::create([
                'name' => $color->sw_Nazwa
            ]);
        }

        Artisan::call("db:seed");

        return ("OK");
    }
}
