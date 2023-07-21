<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSettingsRolesRequest;
use App\Http\Requests\UpdateSettingsRolesRequest;
use Inertia\Inertia;

class SettingsRolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Settings/Roles");
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
    public function store(StoreSettingsRolesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $settingsRoles)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $settingsRoles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSettingsRolesRequest $request, int $settingsRoles)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $settingsRoles)
    {
        //
    }
}
