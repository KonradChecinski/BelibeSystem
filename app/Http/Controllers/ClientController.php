<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Jobs\FromSubiekt\Cena\UpdatePriceFromSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\CreateTowarInSubiekt;
use App\Jobs\UpdateSubiektIdWhereNull;
use App\Models\Client\Client;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
//        UpdatePriceFromSubiekt::dispatch();
//        UpdateSubiektIdWhereNull::dispatchSync();

//        ChangeProductInSubiekt::dispatchSync(Product::find(2));
//        $towar = Towar::find(7597);
//        $cena = $towar->cena;
//        dd($towar, $cena);
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
