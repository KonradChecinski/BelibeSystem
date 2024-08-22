<?php

namespace App\Http\Controllers;

use App\Models\ClientOrder;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderB2bController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modelsB2bOrders = ClientOrder::query()->where("created_at", ">", Carbon::now()->addMonths(-12))->with("invoice")->get();
        $modelsB2bOrders->load(["client"]);
        return Inertia::render("System/Orders/OrderListB2b", [
            "orders" => $modelsB2bOrders,
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
