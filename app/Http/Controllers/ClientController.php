<?php

namespace App\Http\Controllers;
ini_set('max_execution_time', 600);

use App\Helpers\Shoper\Shoper;
use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Jobs\FromSubiekt\Cena\UpdatePriceFromSubiekt;
use App\Jobs\FromSubiekt\ModelTw\CreateModelFromSubiekt;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Jobs\FromSubiekt\Tw\CreateTwFromSubiekt;
use App\Jobs\FromSubiekt\Tw\UpdateTwFromSubiekt;
use App\Jobs\Shoper\ShoperOrderCreateInSubiekt;
use App\Jobs\ToSubiekt\ModelTw\CheckIfExistModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\CreateTowarInSubiekt;
use App\Jobs\UpdateSubiektIdWhereNull;
use App\Models\Client\Client;
use App\Models\Products\Product;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Subiekt\Towar;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
//        CreateTwFromSubiekt::dispatchSync();

//        $productModel = ProductModel::find(5);
//        $productModel->prices()->delete();
//        $productModel->delete();


//        CreateModelFromSubiekt::dispatch();
//        CreateTwFromSubiekt::dispatch();
//        UpdateTwFromSubiekt::dispatch();

//        Shoper::getImages(814);
//        Shoper::deleteImages(814);
//        Shoper::addImages(814, ProductModelColor::find(167));
//        Shoper::getOrder();
        ShoperOrderCreateInSubiekt::dispatchSync();

//        CreateTwFromSubiekt::dispatchSync();

//        CheckIfExistModelInSubiekt::dispatch();
//        CreateModelFromSubiekt::dispatchSync();
//        UpdateTwFromSubiekt::dispatchSync();
//        UpdatePriceFromSubiekt::dispatchSync();
//
//        $updatedStany = Product::query()->whereNotNull("subiekt_id")->get();
//
//        foreach ($updatedStany as $updatedStan) {
////            dd($updatedStan);
//            $productSubiekt = Towar::find($updatedStan->subiekt_id);
//            $stan = $productSubiekt->stany->sum("st_Stan");
//            $stanWszystkie = $productSubiekt->stanyWszystkie->sum("st_Stan");
//            $product = Product::findBySubiektId($updatedStan->subiekt_id);
////            if (is_null($product)) DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->where("id", $updatedStan->subiekt_id)->delete();
//
//            $product->update([
//                "quantity" => $stan,
//                "quantity_total" => $stanWszystkie,
//            ]);
//            $product->save();
//            DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->where("id", $updatedStan->subiekt_id)->delete();

//        }
//        ChangePriceInModelInSubiekt::dispatchSync(ProductModel::find(272));
//        dd(ProductModel::find(272));

//        CreateTowarInSubiekt::dispatchSync(Product::findBySubiektId(2239));
//        ChangeProductInSubiekt::dispatchSync(Product::find(91));
//        UpdateTwFromSubiekt::dispatchSync();
//        UpdateQuantityFromSubiekt::dispatchSync();
//        ProductCategory::create([
//            "name" => "Brak"
//        ]);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
