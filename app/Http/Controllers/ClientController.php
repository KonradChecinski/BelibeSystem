<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Jobs\FromSubiekt\UpdateQuantityFromSubiekt;
use App\Models\Client\Client;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        UpdateQuantityFromSubiekt::dispatch();

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
