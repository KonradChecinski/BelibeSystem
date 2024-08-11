<?php

namespace App\Http\Controllers;

use App\Models\B2bDelivery;
use App\Http\Requests\StoreB2bDeliveryRequest;
use App\Http\Requests\UpdateB2bDeliveryRequest;
use Inertia\Inertia;

class B2bDeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Delivery", [
            "deliveries" => B2bDelivery::all(),
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
    public function store(StoreB2bDeliveryRequest $request)
    {
        B2bDelivery::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bDelivery $b2bDelivery)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bDelivery $b2bDelivery)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bDeliveryRequest $request, B2bDelivery $b2bDelivery)
    {
        $b2bDelivery->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bDelivery $b2bDelivery)
    {
        $b2bDelivery->delete();
    }
}
