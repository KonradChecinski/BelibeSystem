<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;
use App\Models\ClientOrder;
use App\Models\Courier;
use App\Models\Order;
use App\Models\Shipment;
use App\Services\GlsConsignData;
use App\Services\GlsParcel;
use App\Services\GlsShipmentService;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!auth()->user()?->hasAnyPermission(['createShipments', 'editShipments', 'deleteShipments'], 'user')) {
            abort(403);
        }

        return Inertia::render('System/Shipments/Shipments', [
            'shipments' => Shipment::with(['courier', 'user', 'packages', 'orderable'])->latest()->get(),
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
    public function store(StoreShipmentRequest $request)
    {
        $courier = Courier::findOrFail($request->courier_id);
        $orderType = $request->input('order_type', ClientOrder::class);
        $order = ($orderType === Order::class || $orderType === 'App\\Models\\Orders' || $orderType === 'Orders')
            ? Order::findOrFail($request->order_id)
            : ClientOrder::findOrFail($request->order_id);

        $shipmentPackages = $request->input('shipment_packages', []);

        $shipment = DB::transaction(function () use ($request, $courier, $orderType, $order, $shipmentPackages) {
            $shipment = Shipment::create([
                'user_id' => auth()->id(),
                'courier_id' => $courier->id,
                'external_number' => $request->input('external_number'),
                'recipient_country' => $request->input('recipient_country', 'PL'),
                'recipient_name' => $request->recipient_name,
                'recipient_company' => $request->recipient_company,
                'recipient_street' => $request->recipient_street,
                'recipient_building_number' => $request->recipient_building_number,
                'recipient_apartment_number' => $request->recipient_apartment_number,
                'recipient_postal_code' => $request->recipient_postal_code,
                'recipient_city' => $request->recipient_city,
                'recipient_point' => null,
                'recipient_phone' => $request->recipient_phone,
                'recipient_email' => $request->recipient_email,
                'orderable_type' => $orderType,
                'orderable_id' => $order->id,
                'tracking_number' => $request->input('tracking_number'),
                'package_count' => (int)$request->input('package_count', count($shipmentPackages)),
                'cod' => $request->input('cod'),
                'cod_value' => $request->input('cod_value'),
                'label_path' => $request->input('label_path'),
            ]);

            $shipment->packages()->createMany(
                array_map(function ($package) {
                    return [
                        'weight' => $package['weight'] ?? null,
                        'width' => $package['width'] ?? null,
                        'height' => $package['height'] ?? null,
                        'depth' => $package['depth'] ?? null,
                    ];
                }, $shipmentPackages)
            );

            return $shipment;
        });

        return response()->json([
            'message' => __('Shipment created successfully.'),
            'shipment' => $shipment->load(['courier', 'packages']),
        ], 201);
    }

    public function sendToCourier(Shipment $shipment)
    {
        if (!auth()->user()?->hasPermissionTo('editShipments', 'user')) {
            abort(403);
        }

        if ($shipment->external_number) {
            return response()->json([
                'message' => __('Shipment already dispatched.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ]);
        }

        if (!($shipment->orderable instanceof ClientOrder)) {
            return response()->json([
                'message' => __('Courier shipment dispatch is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id !== 1 && $shipment->courier_id !== 2) { // GLS
            return response()->json([
                'message' => __('Courier shipment dispatch is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id === 1) {
            $glsService = new GlsShipmentService();

            $street = $shipment->recipient_street . ' ' . $shipment->recipient_building_number;
            if ($shipment->recipient_apartment_number) {
                $street .= '/' . $shipment->recipient_apartment_number;
            }

            $consignData = new GlsConsignData([
                "name1" => $shipment->recipient_company,
                "name2" => $shipment->recipient_name,

                "country" => $shipment->recipient_country,
                "zipcode" => $shipment->recipient_postal_code,
                "city" => $shipment->recipient_city,
                "street" => $street,

                "phone" => $shipment->recipient_phone,
                "email" => $shipment->recipient_email,

                "date" => now(),
                "comment" => $shipment->orderable->number,
                "COD" => $shipment->cod ? $shipment->cod_value : null,
            ]);

            $parcels = $shipment->packages->map(function ($package) {
                return new GlsParcel([
                    "weight" => $package->weight
                ]);
            });

            try {
                $result = $glsService->createShipment($consignData, $parcels->toArray());
                $externalNumber = is_array($result) ? ($result['consign_id'] ?? null) : $result;

                DB::transaction(function () use ($shipment, $externalNumber) {
                    $shipment->update([
                        'external_number' => $externalNumber,
                    ]);

                    $shipment->orderable->update([
                        'status' => 85,
                    ]);
                });

            } catch (Exception $e) {
                return response()->json([
                    'message' => $e->getMessage() ?: __('Courier shipment dispatch failed.'),
                    'shipment' => $shipment->fresh()->load(['courier', 'packages']),
                ], 422);
            }
        } else if ($shipment->courier_id === 2) {
            return response()->json([
                'message' => __('Courier shipment dispatch is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }


        return response()->json([
            'message' => __('Shipment sent to courier successfully.'),
            'shipment' => $shipment->fresh()->load(['courier', 'packages']),
        ], 200);
    }

    public function getParcelNumbers(Shipment $shipment)
    {
        if (!auth()->user()?->hasPermissionTo('editShipments', 'user')) {
            abort(403);
        }

        if (!$shipment->external_number) {
            return response()->json([
                'message' => __('Shipment not dispatched yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 422);
        }

        if (!($shipment->orderable instanceof ClientOrder)) {
            return response()->json([
                'message' => __('Courier is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id !== 1 && $shipment->courier_id !== 2) { // GLS
            return response()->json([
                'message' => __('Courier is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id === 1) {
            try {
                $glsService = new GlsShipmentService();
                $result = $glsService->getParcelIdFromShipment((int)$shipment->external_number);
                $parcels = is_array($result) ? ($result['parcels_external_ids'] ?? null) : $result;

                if (is_array($parcels)) {
                    if (isset($parcels['number'])) {
                        $parcels = [$parcels];
                    }

                    DB::transaction(function () use ($shipment, $parcels) {
                        $shipment->packages->each(function ($package, $index) use ($parcels) {
                            if (isset($parcels[$index]->number)) {
                                $package->update([
                                    'external_number' => $parcels[$index]->number,
                                ]);
                            }
                        });
                    });

                } else if (is_object($parcels)) {
                    DB::transaction(function () use ($shipment, $parcels) {
                        if (isset($parcels->number)) {
                            $shipment->packages->first()->update([
                                'external_number' => $parcels->number,
                            ]);
                        }
                    });
                }
            } catch (Exception $e) {
                return response()->json([
                    'message' => $e->getMessage() ?: __('Failed to retrieve parcel numbers.'),
                    'shipment' => $shipment->fresh()->load(['courier', 'packages']),
                ], 422);
            }
        } else if ($shipment->courier_id === 2) {
            return response()->json([
                'message' => __('Courier is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        return response()->json([
            'message' => __('Parcel numbers retrieved successfully.'),
            'shipment' => $shipment->fresh()->load(['courier', 'packages']),
        ], 200);
    }

    public function generateLabel(Shipment $shipment)
    {
        if (!auth()->user()?->hasPermissionTo('editShipments', 'user')) {
            abort(403);
        }

        if (!$shipment->external_number) {
            return response()->json([
                'message' => __('Shipment not dispatched yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 422);
        }

        if (!($shipment->orderable instanceof ClientOrder)) {
            return response()->json([
                'message' => __('Courier label generation is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id !== 1 && $shipment->courier_id !== 2) { // GLS
            return response()->json([
                'message' => __('Courier label generation is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        if ($shipment->courier_id === 1) {
            try {
                $glsService = new GlsShipmentService();
                $labelPath = $glsService->getLabelToShipment((int)$shipment->external_number);

                DB::transaction(function () use ($shipment, $labelPath) {
                    $shipment->update([
                        'label_path' => $labelPath,
                    ]);
                    $shipment->orderable->update([
                        'status' => 90,
                    ]);
                });
            } catch (Exception $e) {
                return response()->json([
                    'message' => $e->getMessage() ?: __('Courier label generation failed.'),
                    'shipment' => $shipment->fresh()->load(['courier', 'packages']),
                ], 422);
            }
        } else if ($shipment->courier_id === 2) {
            return response()->json([
                'message' => __('Courier label generation is not implemented yet.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ], 501);
        }

        return response()->json([
            'message' => __('Label generated successfully.'),
            'shipment' => $shipment->fresh()->load(['courier', 'packages']),
        ], 200);
    }

    public function downloadLabel(Shipment $shipment)
    {
        if (!auth()->user()?->hasPermissionTo('editShipments', 'user') && !auth()->user()?->hasPermissionTo('createShipments', 'user')) {
            abort(403);
        }

        if (!$shipment->label_path) {
            return response()->json([
                'message' => __('Shipment label not found.'),
                'shipment' => $shipment->fresh()->load(['courier', 'packages']),
            ]);
        }

        $shipment->orderable->update([
            'status' => 100,
        ]);

        return response()->file(storage_path('app/' . $shipment->label_path));
    }

    /**
     * Display the specified resource.
     */
    public function show(Shipment $shipment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shipment $shipment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShipmentRequest $request, Shipment $shipment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shipment $shipment)
    {
        if (!auth()->user()?->hasPermissionTo('deleteShipments', 'user')) {
            abort(403);
        }

        $shipment->packages()->delete();
        $shipment->delete();

        return response()->json([
            'message' => __('Shipment deleted successfully.'),
        ], 200);
    }

    public function getOrders()
    {
        if (!auth()->user()?->hasPermissionTo('createShipments', 'user')) {
            abort(403);
        }
//        $getCourierForOrder = function ($storedCourierName = null, $fallbackCourierId = null) {
//            if ($fallbackCourierId) {
//                $courier = Courier::query()->find($fallbackCourierId);
//                if ($courier) {
//                    return [
//                        'courierId' => (string) $courier->getKey(),
//                        'courierName' => $courier->name,
//                    ];
//                }
//            }
//
//            if (!is_string($storedCourierName) || trim($storedCourierName) === '') {
//                return [
//                    'courierId' => null,
//                    'courierName' => null,
//                ];
//            }
//
//            $normalizedName = mb_strtolower(trim($storedCourierName));
//            $courier = Courier::query()
//                ->get()
//                ->first(function (Courier $candidate) use ($normalizedName) {
//                    return mb_strtolower(trim((string) $candidate->name)) === $normalizedName;
//                });
//
//            if (! $courier) {
//                return [
//                    'courierId' => null,
//                    'courierName' => trim($storedCourierName),
//                ];
//            }
//
//            return [
//                'courierId' => (string) $courier->getKey(),
//                'courierName' => $courier->name,
//            ];
//        };

        $clientOrders = ClientOrder::query()
            ->whereIn('status', [70, 71])
            ->with(['client', 'location', 'delivery.courier'])
            ->get()
            ->map(function (ClientOrder $order) {
                $client = $order->client;
                $location = $order->location;
                $deliveryCourier = $order->delivery?->courier;

                $isCod = (int)($order->payment_id ?? 0) === 1;

                return [
                    'id' => (string)$order->id,
                    'number' => (string)($order->number ?? $order->id),
                    'orderType' => ClientOrder::class,
                    'label' => 'Zamówienie #' . ($order->number ?? $order->id),
                    'isCod' => $isCod,
                    'codValue' => $isCod ? ($order->total_gross ?? 0) : 0,
                    'createdAt' => $order->created_at?->toISOString() ?? null,
                    'courierId' => $deliveryCourier->id ?? null,
                    'customer' => [
                        'name' => $location?->note ?? '',
                        'company' => $client?->name ?? '',
                        'street' => $location?->street ?? $client?->street ?? '',
                        'buildingNumber' => $location?->building_number ?? $client?->building_number ?? '',
                        'apartmentNumber' => $location?->apartment_number ?? $client?->apartment_number ?? '',
                        'postalCode' => $location?->postal_code ?? $client?->postal_code ?? '',
                        'city' => $location?->city ?? $client?->city ?? '',
                        'country' => 'PL',
                        'phone' => $location?->phone ?? $client?->phone ?? '',
                        'email' => $client?->email ?? '',
                    ],
                    'status' => $order->status,
                    'totalNet' => $order->total_net,
                    'totalGross' => $order->total_gross,
                ];
            });

        $orders = Order::query()
            ->whereIn('status', [70, 71])
            ->get()
            ->map(function (Order $order) {
                $customerName = trim(($order->firstname ?? '') . ' ' . ($order->lastname ?? ''));

                $isCod = (int)($order->payment_method ?? 0) === 1;

                return [
                    'id' => (string)$order->id,
                    'number' => (string)($order->number ?? $order->id),
                    'orderType' => Order::class,
                    'label' => 'Zamówienie #' . ($order->number ?? $order->id),
                    'isCod' => $isCod,
                    'codValue' => $isCod ? ($order->total_gross ?? 0) : 0,
                    'createdAt' => $order->created_at?->toISOString() ?? null,
                    'courierId' => null,
                    'customer' => [
                        'name' => $customerName ?: ($order->company ?: ''),
                        'company' => $order->company ?? '',
                        'street' => $order->street1 ?? '',
                        'buildingNumber' => '',
                        'apartmentNumber' => '',
                        'postalCode' => $order->postcode ?? '',
                        'city' => $order->city ?? '',
                        'country' => $order->country ?? 'PL',
                        'phone' => $order->phone ?? '',
                        'email' => $order->email ?? '',
                    ],
                    'status' => $order->status,
                    'totalGross' => $order->total_gross,
                ];
            });

//        return [...$clientOrders->toArray(), ...$orders->toArray()];
        return collect([...$clientOrders->toArray(), ...$orders->toArray()])->sortByDesc('createdAt')->values()->all();
    }
}
