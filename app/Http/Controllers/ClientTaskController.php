<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\StoreClientTaskRequest;
use App\Http\Requests\Client\UpdateClientTaskRequest;
use App\Models\Client\Client;
use App\Models\ClientTask;

class ClientTaskController extends Controller
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
    public function store(StoreClientTaskRequest $request, Client $client)
    {
        $clientTask = new ClientTask($request->all());
        $clientTask->client()->associate($client);

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            $clientTask->user()->associate($request->user["id"]);
        } else {
            $clientTask->user()->associate(auth()->user());
        }
        $clientTask->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientTask $clientTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientTask $clientTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientTaskRequest $request, Client $client, ClientTask $clientTask)
    {
        if ($clientTask->client != $client) abort(403);

        $clientTask->update($request->all());

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            $clientTask->user()->associate($request->user["id"]);
            $clientTask->save();
        }
//        $clientTask->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientTask $clientTask)
    {
        if ($clientTask->client != $client) abort(403);
        $clientTask->delete();
    }
}
