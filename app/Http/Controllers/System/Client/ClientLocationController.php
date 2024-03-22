<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientLocationRequest;
use App\Http\Requests\Client\UpdateClientLocationRequest;
use App\Models\Client\Client;
use App\Models\ClientLocation;

class ClientLocationController extends Controller
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
    public function store(StoreClientLocationRequest $request, Client $client)
    {
        $clientLocation = new ClientLocation($request->all());
        $clientLocation->country()->associate($request->country["id"]);
        $clientLocation->client()->associate($client);
        $clientLocation->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientLocation $clientLocation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientLocation $clientLocation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientLocationRequest $request, Client $client, ClientLocation $clientLocation)
    {
        if ($clientLocation->client != $client) abort(403);

        $clientLocation->update($request->all());
        $clientLocation->country()->associate($request->country["id"]);
//        $clientLocation->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientLocation $clientLocation)
    {
        if ($clientLocation->client != $client) abort(403);

        $clientLocation->delete();
    }
}
