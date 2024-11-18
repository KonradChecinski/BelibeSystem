<?php

namespace App\Http\Controllers;

use App\Models\ClientOrder;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderOtherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modelsOtherOrders = Order::query()->where("created_at", ">", Carbon::now()->addMonths(-12))->get();
        return Inertia::render("System/Orders/OrderListOther", [
            "orders" => $modelsOtherOrders,
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
    public function show(Order $order)
    {
        $order->load([
            "orderProducts",
//            "orderProducts.product",
            "orderProducts.product:products.id,products.symbol,products.quantity,products.product_size_id,products.product_unit_id,products.product_model_color_id",
            "orderProducts.product.size:id,name",
            "orderProducts.product.unit:id,name",
            "orderProducts.productModel:product_models.id,product_models.name,product_models.symbol",
            "orderProducts.productModelColor" => function ($query) {
                $query->select("product_model_colors.id",
                    "product_model_colors.shortcut",
                    "product_model_colors.name",
                    "product_model_colors.product_model_id");
                $query->withWhereHas("images", function ($query) {
                    $query->where("type", 1);
                    $query->where("order", 0);
                    $query->select("product_model_color_id", "slug");
                });
            },
        ]);
        $orderModel = collect([$order]);


        return response()->json([
            "order" => $order,
            "orderProducts" => $order->orderProducts,
            "products" => $orderModel->pluck("products")->flatten(),
//            "productModels" => $orderModel->pluck("productModels")->flatten()->unique("id")->values(),
//            "productColors" => $orderModel->pluck("productModelColors")->flatten()->unique("id")->values(),
        ]);
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
