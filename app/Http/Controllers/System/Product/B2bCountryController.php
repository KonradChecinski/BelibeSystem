<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreB2bCountryRequest;
use App\Http\Requests\Client\UpdateB2bCountryRequest;
use App\Models\B2bCountry;
use Inertia\Inertia;

class B2bCountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Country", [
            "countries" => B2bCountry::all(),
        ]);

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
    public function store(StoreB2bCountryRequest $request)
    {
        B2bCountry::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bCountry $b2bCountry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bCountry $b2bCountry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bCountryRequest $request, B2bCountry $b2bCountry)
    {
        $b2bCountry->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bCountry $b2bCountry)
    {
        $b2bCountry->delete();
    }
}
