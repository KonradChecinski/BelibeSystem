<?php

namespace App\Http\Controllers;

use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\Client\Client;
use App\Models\User;
use Illuminate\Http\Request;

class TestController extends Controller
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

        $client = new Client([
            "name" => "Belibe2",
            "nip" => "6252455823",
//            "country_id" => 1,
            "city" => "Będzin",
            'street' => "Siemońska",
            'building_number' => 4,
            'postal_code' => "42-500",
            'phone' => "510750316",
            'email' => "test@test.pl",
//            'status_id' => 2,
            'priority' => 3,
//            'source_of_acquisition_id' => 1,
//            'user_id' => 2,
//            'payment_id' => 1,
//            'industry_id' => 1,
            'blacklist' => 0,
        ]);
        $client->country()->associate(1);
        $client->status()->associate(2);
        $client->sourceOfAcquisition()->associate(1);
        $client->payment()->associate(1);
        $client->industry()->associate(1);

        $client->accountManager()->associate(2);


//        $client->save();
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
