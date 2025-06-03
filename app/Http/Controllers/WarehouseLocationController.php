<?php

namespace App\Http\Controllers;

use App\Models\WarehouseLocation;
use App\Http\Requests\StoreWarehouseLocationRequest;
use App\Http\Requests\UpdateWarehouseLocationRequest;
use App\Models\WarehouseLocationRoom;
use Inertia\Inertia;

class WarehouseLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = WarehouseLocationRoom::with(['aisles.locations'])
            ->orderBy('order')
            ->get()
            ->map(function ($room) {
                return [
                    'id' => 'room-' . $room->id,
                    'name' => $room->name,
                    'type' => 'room',
                    'children' => $room->aisles->sortBy('order')->map(function ($aisle) {
                        return [
                            'id' => 'aisle-' . $aisle->id,
                            'name' => $aisle->name,
                            'type' => 'aisle',
                            'parent' => 'room-' . $aisle->warehouse_location_room_id,
                            'children' => $aisle->locations->sortBy('order')->map(function ($shelf) {
                                return [
                                    'id' => 'shelf-' . $shelf->id,
                                    'name' => $shelf->name,
                                    'type' => 'shelf',
                                    'parent' => 'aisle-' . $shelf->warehouse_location_aisle_id,
                                ];
                            })->values()->toArray()
                        ];
                    })->values()->toArray()
                ];
            })->values()->toArray();

        return Inertia::render('System/Settings/Warehouse/Locations', [
            'locations' => $locations,
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
    public function store(StoreWarehouseLocationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseLocation $warehouseLocation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseLocation $warehouseLocation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseLocationRequest $request, WarehouseLocation $warehouseLocation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseLocation $warehouseLocation)
    {
        //
    }
}
