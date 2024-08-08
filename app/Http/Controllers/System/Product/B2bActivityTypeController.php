<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreB2bActivityTypeRequest;
use App\Http\Requests\Client\UpdateB2bActivityTypeRequest;
use App\Models\B2bActivityType;
use Inertia\Inertia;

class B2bActivityTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Activity", [
            "activityTypes" => B2bActivityType::all(),
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
    public function store(StoreB2bActivityTypeRequest $request)
    {
        B2bActivityType::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bActivityType $b2bActivityType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bActivityType $b2bActivityType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bActivityTypeRequest $request, B2bActivityType $b2bActivityType)
    {
        $b2bActivityType->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bActivityType $b2bActivityType)
    {
        $b2bActivityType->delete();
    }
}
