<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use Illuminate\Support\Facades\DB;


class Install5Controller extends Controller
{
    public function install()
    {
        Order::all()->each(function ($order) {
            $count = $order->orderProducts->count();
            $order->total_quantity = $count;
            $order->save();
        });
        Order::query()->orderBy("ordered_at")->get()->each(function ($order, $key) {
            $order->number = "SHP " . str_pad($key + 1, 5, "0", STR_PAD_LEFT);
            $order->save();
        });


        return ("OK");
    }
}
