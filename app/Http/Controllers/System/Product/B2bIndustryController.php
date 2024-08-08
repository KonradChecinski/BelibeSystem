<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreB2bIndustryRequest;
use App\Http\Requests\Client\UpdateB2bIndustryRequest;
use App\Models\B2bIndustry;
use Inertia\Inertia;

class B2bIndustryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Industry", [
            "industries" => B2bIndustry::all(),
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
    public function store(StoreB2bIndustryRequest $request)
    {
        B2bIndustry::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bIndustry $b2bIndustry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bIndustry $b2bIndustry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bIndustryRequest $request, B2bIndustry $b2bIndustry)
    {
        $b2bIndustry->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bIndustry $b2bIndustry)
    {
        $b2bIndustry->delete();
    }
}
