<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\StoreClientTaskRequest;
use App\Http\Requests\Client\UpdateClientTaskRequest;
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
    public function store(StoreClientTaskRequest $request)
    {
        //
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
    public function update(UpdateClientTaskRequest $request, ClientTask $clientTask)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientTask $clientTask)
    {
        $clientTask->delete();
    }
}
