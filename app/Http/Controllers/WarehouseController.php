<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use Illuminate\Support\Facades\DB;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function reload()
    {
        $WarehousesInSubiekt = DB::connection('subiekt')->table('sl_magazyn')->get();

        foreach ($WarehousesInSubiekt as $subiektWarehouse) {

            $warehouse = Warehouse::where('subiekt_id', $subiektWarehouse->mag_Id)->first();
            if (!$warehouse) {
                if ($subiektWarehouse->mag_Status == 0) {
                    continue;
                }

                Warehouse::create([
                    'subiekt_id' => $subiektWarehouse->mag_Id,
                    'symbol' => $subiektWarehouse->mag_Symbol,
                    'name' => $subiektWarehouse->mag_Nazwa,
                ]);
                continue;
            }


            if ($subiektWarehouse->mag_Status == 1) {
                $warehouse->update([
                    'symbol' => $subiektWarehouse->mag_Symbol,
                    'name' => $subiektWarehouse->mag_Nazwa,
                ]);
            } else {
                $warehouse->delete();
            }

        }
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
    public function store(StoreWarehouseRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {
        //
    }
}
