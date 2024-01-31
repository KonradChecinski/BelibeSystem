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
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\Shoper\ShoperChangePrice;
use App\Jobs\Shoper\ShoperChangeShow;
use App\Jobs\Shoper\ShoperOrderCreateInSubiekt;
use App\Jobs\ToSubiekt\Images\AddImagesToSubiekt;
use App\Jobs\ToSubiekt\ModelTw\CheckIfExistModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\CreateTowarInSubiekt;
use App\Jobs\UpdateSubiektIdWhereNull;
use App\Models\B2bActivityType;
use App\Models\B2bCountry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\B2cColor;
use App\Models\Client\Client;
use App\Models\Products\Product;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\Towar;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
//        foreach (ProductModelColor::query()->whereNull("b2c_color_id")->get() as $productModelColor) {
//            $b2cColor = B2cColor::query()->where("name", $productModelColor->b2c_name)->first();
//            if (is_null($b2cColor)) continue;
//
//            $productModelColor->b2cColor()->associate($b2cColor);
//            $productModelColor->save();
////            dd($productModelColor, $b2cColor);
//        }
        return Inertia::render("Clients/ClientList");

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
//        $client
        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        return Inertia::render("Clients/Client", [
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        return Inertia::render("Clients/Client", [
            "editing" => true,
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus
        ]);
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
