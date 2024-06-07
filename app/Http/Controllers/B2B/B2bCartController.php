<?php

namespace App\Http\Controllers\B2B;

use App\Events\CartProductUpdated;
use App\Events\CartSummaryUpdated;
use App\Events\CartUpdated;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreB2bCartRequest;
use App\Http\Requests\Cart\UpdateB2bCartRequest;
use App\Models\B2bCart;
use App\Models\B2bDelivery;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bCartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();
        $cart = $client->cart()->with([
            "product:id,symbol,quantity,product_size_id,product_unit_id",
            "product.size:id,name",
            "product.unit:id,name",
            "productModel:product_models.id,product_models.name,product_models.symbol",
            "productModelColor" => function ($query) {
                $query->select("product_model_colors.id",
                    "product_model_colors.shortcut",
                    "product_model_colors.name",
                    "product_model_colors.product_model_id");
                $query->withWhereHas("images", function ($query) {
                    $query->where("type", 1);
                    $query->where("order", 0);
                    $query->select("product_model_color_id", "path");
                });
            },
        ]);
        $cartModel = $cart->get();
        $priceSummary = $cartModel->map(function ($item) {
            return [
//                "price_net" => $item->price_net,
//                "price_gross" => round($item->price_net * (1 + $item->vat_rate / 100)),
//                "quantity" => $item->quantity,
                "total_net" => $item->price_net * $item->quantity,
                "total_gross" => floor($item->price_net * (1 + $item->vat_rate / 100) * $item->quantity),
            ];
        })->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);

        return Inertia::render('B2B/Cart', [
            "cart" => $cartModel,
            "cartModels" => $cartModel->pluck("productModel")->unique("id")->values(),
            "cartColors" => $cartModel->pluck("productModelColor")->unique("id")->values(),
            "cartPriceSummary" => $priceSummary,
            "client" => $client,

            "locations" => $client->locations()->where("active", true)->with("country:id,name")->get(),
            "payments" => $client->payments,
            "deliveries" => B2bDelivery::all(["id", "name", "price_net", "price_gross",
                'description',
                'free_from',
                'active',
                'delivery_time_min',
                'delivery_time_max',]),
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
    public function store(StoreB2bCartRequest $request)
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
    public function update(UpdateB2bCartRequest $request, Product $product)
    {
        $client = Helper::getClientToB2b();
        if ($client->cart()->where("product_id", $product->id)->count() == 0) {
            $discountedPrices = $product->model->priceForClientB2b($client);
            $currency = $product->model->prices->currency;
            $cartProduct = new B2bCart([
                "quantity" => $request->quantity,
                'price_net' => $discountedPrices['discounted_wholesale_net_price'],
                'vat_rate' => $discountedPrices['vat_rate'],
                'currency' => $currency,
            ]);
            $cartProduct->product()->associate($product);
//            dd($cartProduct->toArray());
            $client->cart()->save($cartProduct);
        } else {
            if ($request->quantity == 0) {
                $client->cart()->where("product_id", $product->id)->delete();
            } else {
                $cartProduct = $client->cart()->where("product_id", $product->id)->first();
                $cartProduct->quantity = $request->quantity;
                $cartProduct->save();
            }

        }
        CartUpdated::dispatch($client->id);
        CartSummaryUpdated::dispatch($client->id);
        CartProductUpdated::dispatch($client->id, $product->id, $request->quantity);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
