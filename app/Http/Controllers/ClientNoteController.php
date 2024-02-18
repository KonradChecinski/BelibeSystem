<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\StoreClientNoteRequest;
use App\Http\Requests\Client\UpdateClientNoteRequest;
use App\Models\Client\Client;
use App\Models\ClientNote;

class ClientNoteController extends Controller
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
    public function store(StoreClientNoteRequest $request, Client $client)
    {
        $clientNote = new ClientNote($request->all());
        $clientNote->client()->associate($client);
        $clientNote->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientNote $clientNote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientNote $clientNote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientNoteRequest $request, Client $client, ClientNote $clientNote)
    {
        if ($clientNote->client != $client) abort(403);

        $clientNote->update($request->all());


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientNote $clientNote)
    {
        if ($clientNote->client != $client) abort(403);
        $clientNote->delete();
    }
}
