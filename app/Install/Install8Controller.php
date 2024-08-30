<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\B2bCart;
use App\Models\Client\Client;
use App\Models\ClientDiscount;
use App\Models\ClientInvoice;
use App\Models\ClientOrder;
use App\Models\ClientOrderProduct;
use App\Models\ClientSettlement;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class Install8Controller extends Controller
{
    public function install()
    {
        ClientOrder::query()->where('status', 6)->update(['status' => 0]);
        ClientOrder::query()->where('status', 5)->update(['status' => 100]);
        ClientOrder::query()->where('status', 4)->update(['status' => 90]);
        ClientOrder::query()->where('status', 3)->update(['status' => 55]);
        ClientOrder::query()->where('status', 2)->update(['status' => 20]);

        Order::query()->where('status', 6)->update(['status' => 0]);
        Order::query()->where('status', 5)->update(['status' => 100]);
        Order::query()->where('status', 4)->update(['status' => 90]);
        Order::query()->where('status', 3)->update(['status' => 55]);
        Order::query()->where('status', 2)->update(['status' => 20]);


        foreach (ClientDiscount::all() as $clientDiscount) {
            $clientDiscount->update([
                "value" => $clientDiscount->value * 100
            ]);
        }

        foreach (B2bCart::all() as $cart) {
            $cart->update([
                "original_price_net" => $cart->price_net
            ]);
        }

        foreach (ClientOrderProduct::all() as $orderProduct) {
            $orderProduct->update([
                "original_price_net" => $orderProduct->price_net
            ]);
        }


        return ("OK");
    }
}
