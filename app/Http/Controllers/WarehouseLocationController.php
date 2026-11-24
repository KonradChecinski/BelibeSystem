<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachWarehouseLocationModelRequest;
use App\Http\Requests\UpdateWarehouseLocationMainRequest;
use App\Http\Requests\UpdateWarehouseLocationOrderRequest;
use App\Models\Products\ProductModel;
use App\Models\WarehouseLocation;
use App\Http\Requests\StoreWarehouseLocationRequest;
use App\Http\Requests\UpdateWarehouseLocationRequest;
use App\Models\WarehouseLocationAisle;
use App\Models\WarehouseLocationRoom;
use Inertia\Inertia;

class WarehouseLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = WarehouseLocationRoom::with([
            'aisles.locations.productModels' => function ($query) {
                $query->select('product_models.id', 'product_models.symbol', 'product_models.name')
                    ->orderBy('product_models.symbol');
            }
        ])
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
                                    'models' => $shelf->productModels->map(function ($model) {
                                        return [
                                            'id' => $model->id,
                                            'symbol' => $model->symbol,
                                            'name' => $model->name,
                                            'is_main' => (bool)$model->pivot->is_main,
                                        ];
                                    })->values()->toArray(),
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
//        dd($request->validated());
        $warehouseLocationAisle = WarehouseLocationAisle::findorFail($request->destination_id);

        $countShelfInAisle = $warehouseLocationAisle->locations()->count();

        $warehouseLocation = new WarehouseLocation([
            'name' => $request->name,
            'order' => $countShelfInAisle,
        ]);

        $warehouseLocationAisle
            ->locations()
            ->save($warehouseLocation);
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
        // Update logic here
        $warehouseLocation->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseLocation $warehouseLocation)
    {
        if ($warehouseLocation->productModels()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Nie można usunąć lokalizacji magazynowej, ponieważ przypisane są do niej produkty.']);
        }
        $warehouseLocation->delete();
    }

    /**
     * Attach a product model to the given warehouse location.
     */
    public function attachModel(AttachWarehouseLocationModelRequest $request, WarehouseLocation $warehouseLocation)
    {
        $productModel = ProductModel::findOrFail($request->validated()['product_model_id']);
        $warehouseLocationsExist = $productModel->warehouseLocations()->exists();

        $productModel->warehouseLocations()->attach($warehouseLocation, [
            'is_main' => !$warehouseLocationsExist,
        ]);
    }

    /**
     * Detach a product model from the given warehouse location.
     */
    public function detachModel(WarehouseLocation $warehouseLocation, ProductModel $productModel)
    {
        $user = auth()->user();
        if (!$user->hasPermissionTo("editDictionary", "user") && !$user->hasPermissionTo("editModel", "user")) {
            abort(403);
        }

        if (!$warehouseLocation->productModels()->where('product_models.id', $productModel->id)->exists()) {
            return redirect()->back()->withErrors([
                'error' => 'Wybrany model produktu nie jest przypisany do tej lokalizacji magazynowej.',
            ]);
        }

        $warehouseLocation->productModels()->detach($productModel);
    }


    /**
     * Update order
     */
    public function updateOrder(UpdateWarehouseLocationOrderRequest $request)
    {
        $locations = $request->validated();
        foreach ($locations as $location) {
            $location = (object)$location;
            $locationObject = null;
            switch ($location->type) {
                case 'room':
                    $locationObject = WarehouseLocationRoom::findOrFail($location->id);
                    $locationObject->order = $location->order;
                    $locationObject->save();
                    break;
                case 'aisle':
                    $locationObject = WarehouseLocationAisle::findOrFail($location->id);
                    $locationObject->order = $location->order;
                    $locationObject->warehouse_location_room_id = $location->parent;
                    $locationObject->save();
                    break;
                case 'shelf':
                    $locationObject = WarehouseLocation::findOrFail($location->id);
                    $locationObject->order = $location->order;
                    $locationObject->warehouse_location_aisle_id = $location->parent;
                    $locationObject->save();
                    break;
            }
        }
    }


}
