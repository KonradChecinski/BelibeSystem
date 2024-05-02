<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Http\Requests\StoreClientOrderRequest;
use App\Models\B2bDelivery;
use App\Models\ClientOrder;
use App\Models\ClientOrderProduct;
use Carbon\Carbon;
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

        if (!$deliveries->contains($request->validated()["delivery"]["id"]) || !$client->payments->contains($request->validated()["payment"]["id"]) || !$client->locations->contains($request->validated()["location"]["id"])) {
            return redirect()->back()->withErrors(["message" => "Client does not have access to this delivery, payment or location"], 403);
        }


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

        $discountModel = $client->payments->find($request->validated()["payment"]["id"])->discount;
        $discount = (bool)$discountModel->discount;
        $discountValue = $discountModel->discount_value;

        if ($discount) {
            $discountedTotalNet = round($priceSummary["total_net"] - ($priceSummary["total_net"] * $discountValue / 100));
            $discountedTotalGross = round($priceSummary["total_gross"] - ($priceSummary["total_gross"] * $discountValue / 100));
        } else {
            $discountedTotalNet = $priceSummary["total_net"];
            $discountedTotalGross = $priceSummary["total_gross"];
        }

        $deliveryModel = $deliveries->find($request->validated()["delivery"]["id"]);
        $deliveryNet = $deliveryModel->price_net;
        $deliveryGross = $deliveryModel->price_gross;
        if ($discountedTotalNet > $deliveryModel->free_from) {
            $deliveryNet = 0;
            $deliveryGross = 0;
        }

        $order = new ClientOrder([
            "number" => "B2B-" . Carbon::now()->format("Y.m.d H:i"),
            "status" => 1,
            "total_quantity" => $quantity,
            "total_net" => $priceSummary["total_net"],
            "total_gross" => $priceSummary["total_gross"],

            "discount" => $discount === true ? $discountValue : 0,
            "discounted_total_net" => $discountedTotalNet,
            "discounted_total_gross" => $discountedTotalGross,

            "delivery_net" => $deliveryNet,
            "delivery_gross" => $deliveryGross,

            "currency" => $cartModel[0]->currency,
            "comment" => $request->comment,
        ]);
        $order->client()->associate($client);
        $order->payment()->associate($request->payment["id"]);
        $order->delivery()->associate($request->delivery["id"]);
        $order->location()->associate($request->location["id"]);
        $order->save();

        foreach ($cartModel as $item) {
            $orderProduct = new ClientOrderProduct([
                "product_id" => $item->product_id,
                "quantity" => $item->quantity,
                "price_net" => $item->price_net,
                "price_gross" => $item->price_gross,
                "total_net" => $item->quantity * $item->total_net,
                "total_gross" => $item->quantity * $item->total_gross,
                "currency" => $item->currency,
            ]);
            $order->products()->save($orderProduct);
        }

        $cart->delete();
        return redirect()->route("b2b.dashboard")->with("success", "Order has been placed successfully");
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
