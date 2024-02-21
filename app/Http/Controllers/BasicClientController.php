<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\UpdateBasicClientRequest;
use App\Http\Requests\Product\UpdateBasicProductModelRequest;
use App\Jobs\ToSubiekt\Towar\ChangeBasicInModelInSubiekt;
use App\Models\Client\Client;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;

class BasicClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function update(UpdateBasicClientRequest $request, Client $client)
    {
        $client->update($request->except(["nip"]));
        $client->country()->associate($request->country["id"]);
        $client->save();
//        ChangeBasicInModelInSubiekt::dispatch($productModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
