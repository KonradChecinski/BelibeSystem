<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Helpers\Prices\Price;
use App\Http\Requests\B2bAgainOrderRequest;
use App\Http\Requests\B2bShowOrderRequest;
use App\Http\Requests\StoreClientOrderRequest;
use App\Jobs\Quantity\ChangeQuantity;
use App\Models\B2bCart;
use App\Models\B2bDelivery;
use App\Models\ClientOrder;
use App\Models\ClientOrderProduct;
use App\Models\Products\Product;
use App\Notifications\b2b\OrderPlacedClient;
use App\Notifications\b2b\OrderPlacedUser;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class B2bOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();
        $orders = $client->orders()->with([
            "payment:id,name",
            "delivery:id,name,description",
            "location:id,street,city,postal_code,apartment_number,building_number,note",
        ])
            ->where("created_at", ">", Carbon::now()->subYear())->get();
//        dd($orders);
        return Inertia::render('B2B/Orders', [
            "orders" => $orders->map(function ($item) {
                return $item->only([
                    "id",
                    "created_at",
                    "number",
                    "status",
                    "total_quantity",
                    "location",
                    "delivery",
                    "delivery_net",
                    "delivery_gross",
                    "payment",
                    "discount",
                    "discounted_total_net",
                    "discounted_total_gross",

                ]);
            }
            )
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
    public function store(StoreClientOrderRequest $request)
    {
        $isToEdit = Helper::isOrderToEdit();
        if ($isToEdit) {
            $clientOrder = Helper::getClientOrderToEditToB2b();
            $clientOrderId = Helper::getClientOrderIdToEditToB2b();
        }


        $client = Helper::getClientToB2b();

        $deliveries = B2bDelivery::all();
        $client->load(["payments", "locations"]);

        if (!$deliveries->contains($request->validated()["delivery"]["id"]) || !$client->payments->contains($request->validated()["payment"]["id"]) || !$client->locations->contains($request->validated()["location"]["id"])) {
            return redirect()->back()->withErrors(["message" => "Client does not have access to this delivery, payment or location"], 403);
        }

        if ($isToEdit) {
            $cart = Helper::getClientOrderProductToEdit($clientOrderId);
        } else {
            $cart = $client->cart();
        }

        $cartModel = $cart->get();

        $quantity = $cartModel->sum("quantity");

        $discountModel = $client->payments->find($request->validated()["payment"]["id"])->discount;
        $discount = (bool)$discountModel->discount;
        $discountValue = $discountModel->discount_value;

        $calculateTotalFromCartItems = Price::calculateTotalFromCartItems($cartModel, $discount, $discountValue);

        $priceSummary = $calculateTotalFromCartItems->priceSummary;
        $discountedPriceSummary = $calculateTotalFromCartItems->discountedPriceSummary;

        $deliveryModel = $deliveries->find($request->validated()["delivery"]["id"]);
        $deliveryNet = $deliveryModel->price_net;
        $deliveryGross = $deliveryModel->price_gross;
        if ($discountedPriceSummary["total_net"] > $deliveryModel->free_from) {
            $deliveryNet = 0;
            $deliveryGross = 0;
        }

        foreach ($cartModel as $item) {
            if ($item->quantity > Product::find($item->product_id)->available_without_order_to_edit) {
//                return redirect()->back()->withErrors(["message" => "Product " . Product::find($item->product_id)->name . " is out of stock"], 403);
                return redirect()->back()->withErrors(["message" => trans("send-message.product_out_of_stock", [
                    "productName" => Product::find($item->product_id)->name,
                ])], 403);
            }
        }

        if ($isToEdit) {
            $order = $clientOrder;
            $order->update([
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
                "client_comment" => $request->client_comment,
            ]);
            if (auth()->guard()->name === 'user') {
                $order->user_comment = $request->user_comment;
            }

            $order->client()->associate($client);
            $order->payment()->associate($request->payment["id"]);
            $order->delivery()->associate($request->delivery["id"]);
            $order->location()->associate($request->location["id"]);
            $order->save();

            $order->orderProducts()->delete();

            foreach ($cartModel as $item) {
                $orderProduct = new ClientOrderProduct([
                    "product_id" => $item->product_id,
                    "quantity" => $item->quantity,
                    "original_price_net" => $item->original_price_net,
                    "price_net" => $item->price_net,
                    "vat_rate" => $item->vat_rate,
                    "currency" => $item->currency,
                ]);
                $order->orderProducts()->save($orderProduct);

                if (!is_null($orderProduct->product)) {
                    ChangeQuantity::dispatch($orderProduct->product);
                }
            }

            return redirect()->route("b2b.order.success")->with(["order" => $order]);
        }

        $lastOrder = ClientOrder::query()->latest()->first();
        $lastNumber = $lastOrder->number ?? 1000;
        $lastNumber = (int)substr($lastNumber, -7);
        $lastNumber++;
        $number = "B2B " . str_pad($lastNumber, 7, "0", STR_PAD_LEFT);

        $order = new ClientOrder([
            "number" => $number,
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
            "client_comment" => $request->client_comment,
        ]);


        if (auth()->guard()->name === 'user') {
            $order->user_comment = $request->user_comment;
        }

        $order->client()->associate($client);
        $order->payment()->associate($request->payment["id"]);
        $order->delivery()->associate($request->delivery["id"]);
        $order->location()->associate($request->location["id"]);
        $order->save();

        foreach ($cartModel as $item) {
            $orderProduct = new ClientOrderProduct([
                "product_id" => $item->product_id,
                "quantity" => $item->quantity,
                "original_price_net" => $item->original_price_net,
                "price_net" => $item->price_net,
                "vat_rate" => $item->vat_rate,
                "currency" => $item->currency,
            ]);
            $order->orderProducts()->save($orderProduct);

            if (!is_null($orderProduct->product)) {
                ChangeQuantity::dispatch($orderProduct->product);
            }
        }

        $cart->delete();


        $client->notify(new OrderPlacedClient($order));
        $client->accountManager->notify(new OrderPlacedUser($order));

        if (auth()->guard()->name === "client") {
            $user = auth()->user();
            if ($user && $client->email !== $user->email) {
                $user->notify(new OrderPlacedClient($order));
            }
        }
        if (auth()->guard()->name === 'user') {
            $user = auth()->user();
            if ($client->accountManager->id !== $user->id) {
                $user->notify(new OrderPlacedUser($order));
            }
        }


        return redirect()->route("b2b.order.success")->with(["order" => $order]);

    }

    /**
     * Display the specified resource.
     */

    public function show(B2bShowOrderRequest $request, ClientOrder $clientOrder)
    {
        $clientOrder->load([
            "orderProducts:client_order_id,product_id,quantity,price_net,vat_rate,currency",
            "payment:id,name",
            "delivery:id,name,description,delivery_time_max,delivery_time_min",
            "location:id,street,city,postal_code,apartment_number,building_number,country_id,note",
            "location.country:id,name",
            "products:products.id,products.symbol,products.quantity,products.product_size_id,products.product_unit_id,products.product_model_color_id",
            "products.size:id,name",
            "products.unit:id,name",
            "productModels:product_models.id,product_models.name,product_models.symbol",
            "productModelColors" => function ($query) {
                $query->select("product_model_colors.id",
                    "product_model_colors.shortcut",
                    "product_model_colors.name",
                    "product_model_colors.product_model_id");
//                $query->withWhereHas("images", function ($query) {
//                    $query->where("type", 1);
//                    $query->where("order", 0);
//                    $query->select("product_model_color_id", "slug");
//                });
                $query->with(["images" => function ($query) {
                    $query->where("type", 1)
                        ->where("order", 0)
                        ->select("product_model_color_id", "slug");
                }]);
            },
        ]);
        $clientOrderModel = collect([$clientOrder]);

        return response()->json([
            "order" => $clientOrder->only([
                "discount",
                "delivery_net",
                "delivery_gross",
                "comment",
                "total_net",
                "total_gross",
                "discounted_total_net",
                "discounted_total_gross",
            ]),
            "orderProducts" => $clientOrder->orderProducts,
            "products" => $clientOrderModel->pluck("products")->flatten(),
            "productModels" => $clientOrderModel->pluck("productModels")->flatten()->unique("id")->values(),
            "productColors" => $clientOrderModel->pluck("productModelColors")->flatten()->unique("id")->values(),
            "payment" => $clientOrder->payment,
            "delivery" => $clientOrder->delivery,
            "location" => $clientOrder->location,
        ]);

    }

    public function success(Request $request)
    {
        if (Helper::isOrderToEdit()) {
            $order = Helper::getClientOrderToEditToB2b();
        } else {
            $order = Helper::getClientToB2b()->orders()->latest()->first();
        }
//        $order = session()->get("order");
        $order->load([
            "delivery:id,name,description,delivery_time_max,delivery_time_min",
            "location:id,street,city,postal_code,apartment_number,building_number",
        ]);

        $orderCreatedTime = Carbon::parse($order->created_at);
        $processTime = Helper::calculateProcessingTime($orderCreatedTime);
        $deliveryTime = Helper::calculateDeliveryTime($orderCreatedTime->addDays($processTime), $order->delivery->delivery_time_min, $order->delivery->delivery_time_max);
//        dd($order, $processTime, $deliveryTime);

        $order = $order->only([
            "number",
            "total_quantity",
            "discounted_total_net",
            "discounted_total_gross",
            "delivery_net",
            "delivery_gross",
            "delivery",
            "location",
            "created_at",
        ]);
        return Inertia::render("B2B/OrderSuccess", [
            "order" => $order,
            "processTime" => [
                "min" => $processTime + $deliveryTime->min_delivery_time,
                "max" => $processTime + $deliveryTime->max_delivery_time,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

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


    public function again(B2bAgainOrderRequest $request, ClientOrder $clientOrder)
    {
        $client = Helper::getClientToB2b();
        $client->cart()->delete();

        foreach ($clientOrder->orderProducts as $orderProduct) {
            $discountedPrices = $orderProduct->productModel->priceForClientB2b($client);
            $cartProduct = new B2bCart([
                "quantity" => $orderProduct->quantity,
                'original_price_net'=> $orderProduct->productModel->prices->wholesale_net_price,
                'price_net' => $discountedPrices['discounted_wholesale_net_price'],
                'vat_rate' => $discountedPrices['vat_rate'],
                'currency' => $orderProduct->currency,
            ]);
            $cartProduct->product()->associate($orderProduct->product_id);

            $client->cart()->save($cartProduct);
        }


    }
}
