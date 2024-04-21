<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreB2bCartRequest;
use App\Http\Requests\Cart\UpdateB2bCartRequest;
use App\Models\B2bCart;
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
            "productModelColor:product_model_colors.id,product_model_colors.shortcut,product_model_colors.name,product_model_colors.product_model_id"
        ]);
        return Inertia::render('B2B/Cart', [
            "cart" => $cart->get(),
            "cartModels" => $cart->get()->pluck("productModel")->unique("id")->values(),
            "cartColors" => $cart->get()->pluck("productModelColor")->unique("id")->values(),
            "client" => $client,

            "locations" => $client->locations,
            "payments" => $client->payments,
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
                'price_gross' => $discountedPrices['discounted_wholesale_gross_price'],
                'currency' => $currency,
            ]);
            $cartProduct->product()->associate($product);
//            dd($cartProduct->toArray());
            $client->cart()->save($cartProduct);
        } else {
            $cartProduct = $client->cart()->where("product_id", $product->id)->first();
            $cartProduct->quantity = $request->quantity;
            $cartProduct->save();
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
