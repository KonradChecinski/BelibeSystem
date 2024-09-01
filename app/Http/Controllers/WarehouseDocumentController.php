<?php

namespace App\Http\Controllers;

use App\Models\WarehouseDocument;
use App\Http\Requests\StoreWarehouseDocumentRequest;
use App\Http\Requests\UpdateWarehouseDocumentRequest;
use Inertia\Inertia;

class WarehouseDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function currentDocuments()
    {
        return Inertia::render('System/Warehouse/DocumentList', [
            'warehouseDocuments' => WarehouseDocument::with(["clientOrder.client"])->whereIn('status', [10, 50])->get(),
        ]);
    }

    public function archivalDocuments()
    {
        return Inertia::render('System/Warehouse/DocumentList', [
            'warehouseDocuments' => WarehouseDocument::query()->where('status', 100)->get(),
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
    public function store(StoreWarehouseDocumentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseDocument $warehouseDocument)
    {
        //
    }

    public function print(WarehouseDocument $warehouseDocument)
    {
        dd($warehouseDocument);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseDocument $warehouseDocument)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseDocumentRequest $request, WarehouseDocument $warehouseDocument)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseDocument $warehouseDocument)
    {
        //
    }
}
