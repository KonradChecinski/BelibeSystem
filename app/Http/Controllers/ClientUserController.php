<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientUserRequest;
use App\Http\Requests\UpdateClientUserRequest;
use App\Models\Client\ClientUser;

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
    public function store(StoreClientUserRequest $request)
    {
        //
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
    public function update(UpdateClientUserRequest $request, ClientUser $clientUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientUser $clientUser)
    {
        //
    }
}
