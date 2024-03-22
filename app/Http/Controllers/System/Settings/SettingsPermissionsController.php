<?php

namespace App\Http\Controllers\System\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreSettingsPermissionsRequest;
use App\Http\Requests\Settings\UpdateSettingsPermissionsRequest;
use Inertia\Inertia;

class SettingsPermissionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/UsersAndPermissions/Permissions");

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
    public function store(StoreSettingsPermissionsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $settingsPermissions)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $settingsPermissions)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSettingsPermissionsRequest $request, int $settingsPermissions)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $settingsPermissions)
    {
        //
    }
}
