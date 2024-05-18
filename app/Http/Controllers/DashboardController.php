<?php

namespace App\Http\Controllers;

use App\Models\ClientOrder;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $b2bOrdersCount = ClientOrder::query()->where("created_at", ">", Carbon::today())->count();
        $otherOrdersCount = Order::query()->where("ordered_at", ">", Carbon::today())->count();

        $b2bOrders = ClientOrder::query()->where("created_at", ">", Carbon::today()->addDays(-7))->get([
            "discounted_total_net", "discounted_total_gross", "delivery_net", "delivery_gross", "total_quantity", "created_at"
        ]);
        $otherOrders = Order::withCount("orderProducts")->where("ordered_at", ">", Carbon::today()->addDays(-7))->get()
            ->map(function ($order) {
                return [
                    "id" => $order->id,
                    "sum" => $order->sum,
                    "ordered_at" => $order->ordered_at,
                    "type" => $order->type,
                    "products_count" => $order->order_products_count,
                    "shipping_cost" => $order->shipping_cost,
                ];
            });

        return Inertia::render("System/Dashboard", [
            "ordersCount" => [
                "other" => $otherOrdersCount,
                "b2b" => $b2bOrdersCount,
            ],
            "orders" => [
                "other" => $otherOrders,
                "b2b" => $b2bOrders,
            ],

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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
