<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Http\Requests\StoreClientOrderRequest;
use App\Models\B2bDelivery;
use App\Models\ClientOrder;
use App\Models\ClientOrderProduct;
use App\Models\Products\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        $priceSummaryGrouped = $cartModel->map(function ($item) {
            return collect([
                "quantity" => $item->quantity,
                "total_net" => $item->price_net,
//                "total_gross" => $item->price_net * (1 + $item->vat_rate / 100) * $item->quantity,
                "vat_rate" => $item->vat_rate,
            ]);
        })->groupBy("vat_rate");

        $priceSummaryGroupByVat = collect();
        foreach ($priceSummaryGrouped as $vat_rate => $items) {
            $total_net = $items->reduce(function ($carry, $item) {
                $carry += $item["total_net"] * $item["quantity"];
                return $carry;
            }, 0);
            $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

            $priceSummaryGroupByVat[$vat_rate] = [
                "total_net" => $total_net,
                "total_gross" => $total_gross,
                "vat_rate" => $vat_rate,
            ];
        }
        $priceSummary = $priceSummaryGroupByVat->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);

//        $total_net = round($total_net, 0);
//        $total_gross = round($total_gross, 0);
//        $priceSummary = $priceSummary->reduce(function ($carry, $item) {
//            $carry["total_net"] += $item["total_net"];
//
//            return $carry;
//        }, collect(["total_net" => 0, "total_gross" => 0, "vat_rate" => 0]))->map(function ($item) {
//            return round($item, 0);
//        });
//        $priceSummary->total_gross

        $quantity = $cartModel->sum("quantity");

        $discountModel = $client->payments->find($request->validated()["payment"]["id"])->discount;
        $discount = (bool)$discountModel->discount;
        $discountValue = $discountModel->discount_value;

        if ($discount) {
//            $discountedTotalNet = round($priceSummary["total_net"] - ($priceSummary["total_net"] * $discountValue / 100));
//            $discountedTotalGross = round($priceSummary["total_gross"] - ($priceSummary["total_gross"] * $discountValue / 100));

//            $discountedNet = 0;
//            $discountedGross = 0;
//            foreach ($cartModel as $item) {
//                $discountedNet += ($item->price_net * $item->quantity) - (round($item->price_net * (100 - $discountValue) / 100) * $item->quantity);
//                $discountedGross += round($item->price_net * $item->quantity * (1 + $item->vat_rate / 100)) -
//                    round(round($item->price_net * (100 - $discountValue) / 100) * $item->quantity * (1 + $item->vat_rate / 100));
//            }
//            $discountedTotalNet = $priceSummary["total_net"] - floor($discountedNet);
//            $discountedTotalGross = $priceSummary["total_gross"] - floor($discountedGross);


//            dd([
//                "total" => $priceSummary["total_net"] / 100,
//                "discount" => $discountedNet / 100,
//                "discounted_total" => $discountedTotalNet / 100
//            ],
//                [
//                    "total" => $priceSummary["total_gross"] / 100,
//                    "discount" => floor($discountedGross) / 100,
//                    "discounted_total" => $discountedTotalGross / 100
//                ]);

            $discountedPriceSummaryGroupByVat = collect();
            foreach ($priceSummaryGrouped as $vat_rate => $items) {
                $total_net = $items->reduce(function ($carry, $item) use ($discountValue) {
                    $carry += (round($item["total_net"] * (100 - $discountValue) / 100) * $item["quantity"]);
                    return $carry;
                }, 0);
                $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

                $discountedPriceSummaryGroupByVat[$vat_rate] = [
                    "total_net" => $total_net,
                    "total_gross" => $total_gross,
                    "vat_rate" => $vat_rate,
                ];
            }
            $discountedPriceSummary = $discountedPriceSummaryGroupByVat->reduce(function ($carry, $item) {
                $carry["total_net"] += $item["total_net"];
                $carry["total_gross"] += $item["total_gross"];
                return $carry;
            }, ["total_net" => 0, "total_gross" => 0]);


        } else {
            $discountedPriceSummary = $priceSummary;
//            $discountedTotalNet = $priceSummary["total_net"];
//            $discountedTotalGross = $priceSummary["total_gross"];
        }

        $deliveryModel = $deliveries->find($request->validated()["delivery"]["id"]);
        $deliveryNet = $deliveryModel->price_net;
        $deliveryGross = $deliveryModel->price_gross;
        if ($discountedPriceSummary["total_net"] > $deliveryModel->free_from) {
            $deliveryNet = 0;
            $deliveryGross = 0;
        }

        foreach ($cartModel as $item) {
            if ($item->quantity > Product::find($item->product_id)->available) {
                return redirect()->back()->withErrors(["message" => "Product " . Product::find($item->product_id)->name . " is out of stock"], 403);
            }
        }

        $order = new ClientOrder([
            "number" => "B2B-" . Carbon::now()->format("Y.m.d H:i"),
            "status" => 1,
            "total_quantity" => $quantity,
            "total_net" => $priceSummary["total_net"],
            "total_gross" => $priceSummary["total_gross"],

            "discount" => $discount === true ? $discountValue : 0,
            "discounted_total_net" => $discountedPriceSummary["total_net"],
            "discounted_total_gross" => $discountedPriceSummary["total_gross"],

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
                "vat_rate" => $item->vat_rate,
                "currency" => $item->currency,
            ]);
            $order->orderProducts()->save($orderProduct);
        }

        $cart->delete();
        return redirect()->route("b2b.order.success")->with("success", "Order has been placed successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        return Inertia::render("B2B/OrderSuccess");
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
