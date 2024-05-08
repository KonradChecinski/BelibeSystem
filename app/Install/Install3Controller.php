<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Models\B2bActivityType;
use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
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

class Install3Controller extends Controller
{
    public function install()
    {
        B2bActivityType::create([
            "name" => "Spotkanie",
        ]);
        B2bActivityType::create([
            "name" => "Telefon",
        ]);
        B2bActivityType::create([
            "name" => "Oferta",
        ]);
        B2bActivityType::create([
            "name" => "Trasa/Wyjazd",
        ]);
        B2bActivityType::create([
            "name" => "Windykacja",
        ]);


        B2bCountry::create([
            "name" => "Polska",
        ]);
        B2bCountry::create([
            "name" => "Słowacja",
        ]);
        B2bCountry::create([
            "name" => "Czechy",
        ]);


        B2bPayment::create([
            "name" => "Pobranie",
            "type" => 1,
        ]);
        B2bPayment::create([
            "name" => "Termin 3 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 7 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 14 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 21 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 30 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 45 dni",
            "type" => 2,
        ]);
        B2bPayment::create([
            "name" => "Termin 60 dni",
            "type" => 2,
        ]);


        B2bSourceOfAcquisition::create([
            "name" => "Osobiście",
        ]);
        B2bSourceOfAcquisition::create([
            "name" => "Polecenie",
        ]);
        B2bSourceOfAcquisition::create([
            "name" => "Internet",
        ]);
        B2bSourceOfAcquisition::create([
            "name" => "Telefon",
        ]);


        B2bStatus::create([
            "name" => "Nieaktywny",
        ]);
        B2bStatus::create([
            "name" => "Aktywny",
        ]);
        B2bStatus::create([
            "name" => "Potencjalny",
        ]);


        B2bIndustry::create([
            "name" => "Bielizna",
        ]);
        B2bIndustry::create([
            "name" => "Sklep basen",
        ]);
        B2bIndustry::create([
            "name" => "Medyczny",
        ]);
        B2bIndustry::create([
            "name" => "Odzieżowy",
        ]);
        B2bIndustry::create([
            "name" => "Sportowy",
        ]);
        B2bIndustry::create([
            "name" => "Supermarket",
        ]);
        B2bIndustry::create([
            "name" => "Hurtownia",
        ]);
        B2bIndustry::create([
            "name" => "Hotel",
        ]);
        B2bIndustry::create([
            "name" => "Morsy",
        ]);
        B2bIndustry::create([
            "name" => "Klub sportowy",
        ]);


        return ("OK");
    }
}
