<?php

namespace App\Helpers\Shoper;

use App\Models\Products\ProductModelColor;
use App\Models\ShoperToken;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class Shoper
{
    public static function login(): bool
    {
        $response = Http::withoutVerifying()
            ->asForm()->post(env('SHOPER_URL') . '/webapi/rest/auth', [
                "client_id" => env('SHOPER_LOGIN'),
                "client_secret" => env('SHOPER_PASSWORD'),
            ]);
        if ($response->status() !== 200) {
            return false;
        }
        $json = $response->json();
        ShoperToken::create(array_merge($json, ["expires_at" => Carbon::now()->addSeconds($json["expires_in"])]));
        return true;
    }

    private static function getAccessToken(): string
    {
        $token = ShoperToken::where("expires_at", ">", Carbon::now())->orderBy("id", "desc")->first();
        if (is_null($token)) {
            return self::login();
        }
        return $token->access_token;
    }

    public static function getOrder(): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/orders', [
                "order" => ["order_id"],
                "limit" => 50,
                "filters" => json_encode([
                    "order_id" => ['>' => '1310'],
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        $orderId = $response->json()["list"][1]["order_id"];
        $response2 = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/order-products', [
                "limit" => 50,
                "filters" => json_encode([
                    "order_id" => ['=' => $orderId],
                ]),

            ]);

        dd($response, $response->status(), $response->body(), $response->json(), $response2->status(), $response2->body(), $response2->json());


    }

    public static function getImages($productId): array
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/product-images', [
//                "order" => ["order_id"],
                "limit" => 50,
                "filters" => json_encode([
                    "product_id" => ['=' => $productId],
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return self::getImages($productId);
        }

        return $response->json();
    }

    public static function deleteImages($productId): bool
    {
        $productImages = self::getImages($productId);
        if (!$productImages) {
            return false;
        }

        foreach ($productImages["list"] as $productImage) {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->asForm()->delete(env('SHOPER_URL') . '/webapi/rest/product-images/' . $productImage["gfx_id"]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        }
        return true;
    }

    public static function addImages(int $productShoperId, ProductModelColor $productModelColor): bool
    {
        foreach ($productModelColor->images->sortBy("order")->values() as $image) {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/product-images', [
                    "product_id" => $productShoperId,
                    "url" => str_replace("test", "pl", url("images", ['path' => $image->path])),
                    "translations" => [
                        "pl_PL" => [
                            "name" => $productModelColor->model->symbol . "-" . $productModelColor->shortcut
                        ]
                    ]
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        }
        return true;
    }

    public static function changePrice(int $productId, ProductModelColor $productModelColor): bool
    {

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "stock" => [
                    "price" => (float)$productModelColor->model->prices->retail_gross_price / 100,
                ]
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }
}
