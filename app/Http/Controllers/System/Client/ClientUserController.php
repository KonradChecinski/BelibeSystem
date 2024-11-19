<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreClientUserRequest;
use App\Http\Requests\Auth\UpdateClientUserRequest;
use App\Models\Client\Client;
use App\Models\Client\ClientUser;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        ];
        $clientUser->update($validatedClientUserCredential);

        if (strlen($request->password) > 0) {
            $clientUser->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => null,
            ])->save();
            event(new PasswordReset($clientUser));
        }
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
