<?php

namespace App\Helpers\Allegro;

use App\Models\AllegroToken;
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
//            ->withToken(self::getToken())
            ->withHeaders([
                "Authorization", "Bearer " . self::getToken(),
                "Content-Type", "application/vnd.allegro.public.v1+json"
            ])->acceptJson()
            ->get("https://allegro.pl/order/checkout-forms");
//        , [
//        "status" => "READY_FOR_PROCESSING",
//        "fulfillment.status" => "NEW",
//    ]
        dd($response, $response->status(), $response->json());


//        if($response->status() !== 401) {
//            //Token wygasł
//        }

    }

}
