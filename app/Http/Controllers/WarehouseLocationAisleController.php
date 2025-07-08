<?php

namespace App\Http\Controllers;

use App\Models\WarehouseLocationAisle;
use App\Http\Requests\StoreWarehouseLocationAisleRequest;
use App\Http\Requests\UpdateWarehouseLocationAisleRequest;
use App\Models\WarehouseLocationRoom;

class WarehouseLocationAisleController extends Controller
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
    public function store(StoreWarehouseLocationAisleRequest $request)
    {
        $warehouseLocationRoom = WarehouseLocationRoom::findorFail($request->destination_id);

        $countAislesInRoom = $warehouseLocationRoom->aisles()->count();

        $warehouseLocationAisle = new WarehouseLocationAisle([
            'name' => $request->name,
            'order' => $countAislesInRoom,
        ]);

        $warehouseLocationRoom
            ->aisles()
            ->save($warehouseLocationAisle);
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseLocationAisle $warehouseLocationAisle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseLocationAisle $warehouseLocationAisle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseLocationAisleRequest $request, WarehouseLocationAisle $warehouseLocation)
    {
        // Update logic here
        $warehouseLocation->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseLocationAisle $warehouseLocation)
    {
        if ($warehouseLocation->locations()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Nie można usunąć aleji magazynowej, ponieważ zawiera ona półki.']);
        }
        $warehouseLocation->delete();
    }
}
