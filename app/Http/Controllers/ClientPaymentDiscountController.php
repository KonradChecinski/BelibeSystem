<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\StoreClientDiscountRequest;
use App\Http\Requests\Client\StoreClientPaymentDiscountRequest;
use App\Http\Requests\Client\UpdateClientDiscountRequest;
use App\Http\Requests\Client\UpdateClientPaymentDiscountRequest;
use App\Models\B2bPayment;
use App\Models\Client\Client;
use App\Models\ClientDiscount;

class ClientPaymentDiscountController extends Controller
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
    public function store(StoreClientPaymentDiscountRequest $request, Client $client)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientDiscount $clientDiscount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientDiscount $clientDiscount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientPaymentDiscountRequest $request, Client $client, B2bPayment $b2bPayment)
    {
        $payment = $client->payments->find($b2bPayment->id);
        if (is_null($payment)) abort(403);
        $paymentDiscount = $payment->discount;
        $paymentDiscount->discount = $request->discount;
        $paymentDiscount->discount_value = $request->discount_value;
        $paymentDiscount->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
