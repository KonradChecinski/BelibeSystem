<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerSettlement;
use App\Http\Requests\StorePartnerSettlementRequest;
use App\Http\Requests\UpdatePartnerSettlementRequest;
use Inertia\Inertia;

class PartnerSettlementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Partner $partner)
    {
        return Inertia::render("System/Partners/PartnerSettlements", [
            "partner" => $partner,
            "settlements" => $partner->partnerSettlements()->with("items"),
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
    public function store(StorePartnerSettlementRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerSettlementRequest $request, PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PartnerSettlement $partnerSettlement)
    {
        //
    }
}
