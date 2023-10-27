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

class ClearDBController extends Controller
{
    public function clear()
    {
        DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Dok_Created")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Dok_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_GrupyTw_Created")->truncate();
        DB::connection("subiekt")->table("Belibe_System_GrupyTw_Deleted")->truncate();
        DB::connection("subiekt")->table("Belibe_System_GrupyTw_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_ModelTw_Created")->truncate();
        DB::connection("subiekt")->table("Belibe_System_ModelTw_Deleted")->truncate();
        DB::connection("subiekt")->table("Belibe_System_ModelTw_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Tw_Created")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->truncate();
        DB::connection("subiekt")->table("Belibe_System_Zdjecia_Zmienione")->truncate();


        return ("OK");
    }
}
