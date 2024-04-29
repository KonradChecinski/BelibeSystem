<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Http\Requests\StoreClientOrderRequest;
use App\Models\B2bDelivery;
use App\Models\ClientOrder;
use Illuminate\Http\Request;

class B2bOrderController extends Controller
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
    public function store(StoreClientOrderRequest $request)
    {
        $client = Helper::getClientToB2b();

        $deliveries = B2bDelivery::all();
        $client->load(["payments", "locations"]);
        dd($deliveries, $client->payments, $client->locations);
//Sprawdzic czy klient ma dostepne te metody platnosci i dostawy
        $cart = $client->cart();
        $cartModel = $cart->get();

        $priceSummary = $cartModel->map(function ($item) {
            return [
                "price_net" => $item->price_net,
                "price_gross" => $item->price_gross,
                "quantity" => $item->quantity,
                "total_net" => $item->price_net * $item->quantity,
                "total_gross" => $item->price_gross * $item->quantity,
            ];
        })->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);

        $quantity = $cartModel->sum("quantity");


        $order = new ClientOrder([
            "number" => "",
            "status" => 1,
            "total_net" => $priceSummary["total_net"],
            "total_gross" => $priceSummary["total_gross"],
            "total_quantity" => $quantity,
            "comment" => $request->comment,
        ]);
        $order->client()->associate($client);
        $order->payment()->associate($request->payment["id"]);
        $order->delivery()->associate($request->delivery["id"]);
        $order->location()->associate($request->location["id"]);
        dd($request->all(), $order);
        $order->save();
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
