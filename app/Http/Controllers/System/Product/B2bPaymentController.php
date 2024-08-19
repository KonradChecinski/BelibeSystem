<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreB2bPaymentRequest;
use App\Http\Requests\Client\UpdateB2bPaymentRequest;
use App\Models\B2bPayment;
use Inertia\Inertia;

class B2bPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Payment", [
            "payments" => B2bPayment::all(),
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
    public function store(StoreB2bPaymentRequest $request)
    {
        B2bPayment::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bPayment $b2bPayment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bPayment $b2bPayment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bPaymentRequest $request, B2bPayment $b2bPayment)
    {
        $b2bPayment->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bPayment $b2bPayment)
    {
        $b2bPayment->delete();
    }
}
