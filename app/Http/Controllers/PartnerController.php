<?php

namespace App\Http\Controllers;

use App\Helpers\Subiekt\SubiektQueries;
use App\Models\Partner;
use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use App\Models\Products\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $partners = Partner::all();
        return Inertia::render("System/Partners/PartnerList", [
            "partners" => $partners,
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
    public function store(StorePartnerRequest $request)
    {
        Partner::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Partner $partner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partner $partner)
    {
        return Inertia::render("System/Partners/PartnerEdit", [
            "partner" => $partner->load("client"),
            "subiektCategories" => SubiektQueries::getDocumentCategory()->map(function ($category) {
                return [
                    "id" => $category->kat_Id,
                    "name" => $category->kat_Nazwa,
                ];
            }),
            "subiektWarehouses" => SubiektQueries::getActiveWarehouse()->map(function ($warehouse) {
                return [
                    "id" => $warehouse->mag_Id,
                    "name" => $warehouse->mag_Symbol . " - " . $warehouse->mag_Nazwa,
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerRequest $request, Partner $partner)
    {
        $partner->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner)
    {
        $partner->delete();
    }
}
