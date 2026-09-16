<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Http\Requests\StoreCourierRequest;
use App\Http\Requests\UpdateCourierRequest;

class CourierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!auth()->user()?->hasAnyPermission(['createShipments', 'editShipments', 'deleteShipments'], 'user')) {
            abort(403);
        }

        return Courier::query()
            ->orderBy('name')
            ->get()
            ->map(function (Courier $courier) {
                return [
                    'id' => (string)$courier->getKey(),
                    'name' => $courier->name,
                    'logo' => $courier->logo,
                    'trackingUrl' => $courier->tracking_url,
                    'supportsCOD' => (bool)$courier->supports_cod,
                    'allowsMultiplePackages' => (bool)$courier->allows_multiple_packages,
                    'packageFields' => [
                        'weight' => [
                            'enabled' => (bool)$courier->weight_enabled,
                            'required' => (bool)$courier->weight_required,
                        ],
                        'width' => [
                            'enabled' => (bool)$courier->width_enabled,
                            'required' => (bool)$courier->width_required,
                        ],
                        'height' => [
                            'enabled' => (bool)$courier->height_enabled,
                            'required' => (bool)$courier->height_required,
                        ],
                        'depth' => [
                            'enabled' => (bool)$courier->depth_enabled,
                            'required' => (bool)$courier->depth_required,
                        ],
                    ],
                ];
            });
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
    public function store(StoreCourierRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Courier $courier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Courier $courier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourierRequest $request, Courier $courier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Courier $courier)
    {
        //
    }
}
