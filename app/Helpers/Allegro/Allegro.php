<?php

namespace App\Helpers\Allegro;

use App\Models\AllegroToken;
use App\Models\Order;
use Illuminate\Support\Facades\Http;

class Allegro
{
    private static function getToken()
    {
        return AllegroToken::query()->latest()->first()?->access_token;
    }

    public static function getOrders()
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/order/checkout-forms", [
                "status" => "READY_FOR_PROCESSING",
                "fulfillment.status" => "NEW",
            ]);

//        dd($response, $response->status(), $response->json());

        $orders = $response->json()["checkoutForms"];
        foreach ($orders as $order) {
            dd($order);

//            $shoperOrderModel = Order::create([
//                "number" => $number,
//                "type" => 1,
//                "status" => 2,
//                "order_id" => $shoperOrder["order_id"],
//                "ordered_at" => $shoperOrder["date"],
//                "total_quantity" => count($shoperOrderProducts),
//                "total_gross" => $shoperOrder["sum"],
//                "payment_name" => $paymentName,
//                "delivery_name" => $shippingName,
//                "delivery_gross" => $shoperOrder["shipping_cost"],
//                "promo_code" => $shoperOrder["promo_code"],
//                "email" => $shoperOrder["email"],
//                "firstname" => $shoperOrder["billing_address"]["firstname"],
//                "lastname" => $shoperOrder["billing_address"]["lastname"],
//                "company" => $shoperOrder["billing_address"]["company"],
//                "city" => $shoperOrder["billing_address"]["city"],
//                "postcode" => $shoperOrder["billing_address"]["postcode"],
//                "street1" => $shoperOrder["billing_address"]["street1"],
//                "country" => $shoperOrder["billing_address"]["country"],
//                "phone" => $shoperOrder["billing_address"]["phone"],
//                "tax_id" => $shoperOrder["billing_address"]["tax_identification_number"],
//                "subiekt_number" => "",
//                "subiekt_added_at" => null
//            ]);
        }


//        if($response->status() !== 401) {
//            //Token wygasł
//        }

    }

}
