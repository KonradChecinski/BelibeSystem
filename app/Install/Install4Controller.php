<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use Illuminate\Support\Facades\DB;


class Install4Controller extends Controller
{
    public function install()
    {
        foreach (ProductModel::all() as $productModel) {
            $productModel->generateSlug();
            $productModel->save();
        }

        $orders = DB::table("shoper_orders")->get();
        $orderProducts = DB::table("shoper_order_products")->get();

        $arrayIds = [];
        foreach ($orders as $order) {
            $newOrder = Order::create([
                ...(array)$order,
                "type" => 1,
                "status" => 5,
            ]);
            $arrayIds[$order->id] = $newOrder->id;

//            $newOrder->update([
//                "created_at" => $order->created_at,
//            ]);
        }
        print_r($arrayIds);

        foreach ($orderProducts as $orderProduct) {

            $product = Product::query()->where("symbol", $orderProduct->code)->first();

            if (is_null($product)) {
                OrderProduct::create([
                    ...(array)$orderProduct,
                    "order_id" => $arrayIds[$orderProduct->shoper_order_id],
                    "product_code" => $orderProduct->code,

                ]);
            } else {
                OrderProduct::create([
                    ...(array)$orderProduct,
                    "order_id" => $arrayIds[$orderProduct->shoper_order_id],
                    "product_id" => $product->id,
                ]);
            }
        }


        return ("OK");
    }
}
