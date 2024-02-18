<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\StoreClientUserRequest;
use App\Http\Requests\Auth\UpdateClientUserRequest;
use App\Models\Client\Client;
use App\Models\Client\ClientUser;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ClientUserController extends Controller
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
    public function store(StoreClientUserRequest $request, Client $client)
    {
        $validatedClientUserCredential = [
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ];

        $clientUser = new ClientUser($validatedClientUserCredential);
        $clientUser->client()->associate($client);
        $clientUser->save();

        event(new Registered($clientUser));
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientUser $clientUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientUser $clientUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientUserRequest $request, Client $client, ClientUser $clientUser)
    {
        if ($clientUser->client != $client) abort(403);

        $validatedClientUserCredential = [
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ];
        $clientUser->update($validatedClientUserCredential);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientUser $clientUser)
    {
        if ($clientUser->client != $client) abort(403);
        
        $clientUser->delete();
//        dd($clientUser);
    }
}
