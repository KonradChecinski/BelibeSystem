<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientActivityRequest;
use App\Http\Requests\Client\UpdateClientActivityRequest;
use App\Models\Client\Client;
use App\Models\ClientActivity;

class ClientActivityController extends Controller
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
    public function store(StoreClientActivityRequest $request, Client $client)
    {
        $clientActivity = new ClientActivity($request->all());
        $clientActivity->client()->associate($client);
        $clientActivity->activityType()->associate($request->type["id"]);

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            $clientActivity->user()->associate($request->user["id"]);
        } else {
            $clientActivity->user()->associate(auth()->user());
        }

        $clientActivity->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientActivity $clientActivity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientActivity $clientActivity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientActivityRequest $request, Client $client, ClientActivity $clientActivity)
    {
        if ($clientActivity->client != $client) abort(403);

        $clientActivity->update($request->all());
        $clientActivity->activityType()->associate($request->type["id"]);

        if (auth()->user()->hasPermissionTo("changeUserInClientRelation", "user")) {
            $clientActivity->user()->associate($request->user["id"]);
        }
        $clientActivity->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientActivity $clientActivity)
    {
        if ($clientActivity->client != $client) abort(403);

        $clientActivity->delete();
    }
}
