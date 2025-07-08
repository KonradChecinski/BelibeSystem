<?php

namespace App\Http\Controllers;

use App\Models\WarehouseLocationAisle;
use App\Models\WarehouseLocationRoom;
use App\Http\Requests\StoreWarehouseLocationRoomRequest;
use App\Http\Requests\UpdateWarehouseLocationRoomRequest;

class WarehouseLocationRoomController extends Controller
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
    public function store(StoreWarehouseLocationRoomRequest $request)
    {
        $countRooms = WarehouseLocationRoom::query()->count();

        $warehouseLocationRoom = new WarehouseLocationRoom([
            'name' => $request->name,
            'order' => $countRooms,
        ]);

        $warehouseLocationRoom
            ->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseLocationRoom $warehouseLocationRoom)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseLocationRoom $warehouseLocationRoom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseLocationRoomRequest $request, WarehouseLocationRoom $warehouseLocation)
    {
        $warehouseLocation->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseLocationRoom $warehouseLocation)
    {
        if ($warehouseLocation->aisles()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Nie można usunąć pokoju magazynowej, ponieważ zawiera ona aleje.']);
        }
        $warehouseLocation->delete();
    }
}
