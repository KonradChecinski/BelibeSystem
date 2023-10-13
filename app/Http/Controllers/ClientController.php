<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Jobs\FromSubiekt\UpdatePriceFromSubiekt;
use App\Jobs\FromSubiekt\UpdateQuantityFromSubiekt;
use App\Models\Client\Client;
use App\Models\GS1Brand;
use App\Models\GS1GPC;
use App\Models\ProductBrand;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;
use Illuminate\Support\Facades\Http;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
//        UpdatePriceFromSubiekt::dispatch();
//        $response = Http::withoutVerifying()
//            ->withBasicAuth(env('GS1_LOGIN'), env('GS1_PASSWORD'))
//            ->get('https://mojegs1.pl/api/v2/products', [
//                "sort" => "-gtin",
//                "page[limit]" => 1,
//                "page[offset]" => 1,
//            ]);
//        dd($response->json()["data"][0]);
        dd(GS1GPC::all());
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
