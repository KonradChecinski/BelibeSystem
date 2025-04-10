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
use App\Models\ClientOrderProductEdit;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bCartController extends Controller
{

    protected $cartService;

    // automatyczne wstrzyknięcie zależności
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();

        if (Helper::isOrderToEdit()) {
//            $clientOrder = Helper::getClientOrderToEditToB2b();
            $clientOrderId = Helper::getClientOrderIdToEditToB2b();

            $cart = Helper::getClientOrderProductToEdit($clientOrderId)->with([
                "product:id,symbol,quantity,product_size_id,product_unit_id",
                "product.size:id,name",
                "product.unit:id,name",
                "productModel:product_models.id,product_models.name,product_models.symbol",
                "productModelColor" => function ($query) {
                    $query->select("product_model_colors.id",
                        "product_model_colors.shortcut",
                        "product_model_colors.name",
                        "product_model_colors.product_model_id");
                    $query->with("images", function ($query) {
                        $query->where("type", 1);
                        $query->where("order", 0);
                        $query->select("product_model_color_id", "slug");
                    });
                },
            ]);
            $cartModel = $cart->get();
//            dd($clientOrder, $clientOrder->products, $cart, $cartModel);
        } else {
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
                    $query->with("images", function ($query) {
                        $query->where("type", 1);
                        $query->where("order", 0);
                        $query->select("product_model_color_id", "slug");
                    });
                },
            ]);
            $cartModel = $cart->get();
        }


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

//        dd($priceSummary);
//        dd([
//            "cart" => $cartModel,
//            "cartModels" => $cartModel->pluck("productModel")->unique("id")->values(),
//            "cartColors" => $cartModel->pluck("productModelColor")->unique("id")->values(),
//            "cartPriceSummary" => $priceSummary,
//            "client" => $client,
//
//            "locations" => $client->locations()->where("active", true)->with("country:id,name")->get(),
//            "payments" => $client->payments,
//            "deliveries" => B2bDelivery::all(["id", "name", "price_net", "price_gross",
//                'description',
//                'free_from',
//                'active',
//                'delivery_time_min',
//                'delivery_time_max',]),
//        ]);

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

        $this->cartService->addOrUpdateProduct($client, $product, $request->quantity);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $this->cartService->clearCart();
    }
}
