<?php

namespace App\Http\Controllers;

use App\Models\SettingsDictionarySize;
use App\Http\Requests\StoreSettingsDictionarySizeRequest;
use App\Http\Requests\UpdateSettingsDictionarySizeRequest;
use Inertia\Inertia;

class SettingsDictionarySizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Settings/Dictionaries/Sizes");

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
    public function store(StoreSettingsDictionarySizeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SettingsDictionarySize $settingsDictionarySize)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SettingsDictionarySize $settingsDictionarySize)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSettingsDictionarySizeRequest $request, SettingsDictionarySize $settingsDictionarySize)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SettingsDictionarySize $settingsDictionarySize)
    {
        //
    }
}
