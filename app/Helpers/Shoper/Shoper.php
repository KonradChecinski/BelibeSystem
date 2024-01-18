<?php

namespace App\Helpers\Shoper;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\ShoperOrder;
use App\Models\ShoperToken;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

    public static function findIdColor(ProductModelColor $productModelColor): int|null
    {

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/products', [
                "limit" => 1,
                "filters" => json_encode([
                    "stock.code" => ['=' => $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut],
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return null;
        }
        if ($response->json()["count"] == 0) {
            Log::alert($productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut . " not find in shoper");
            return null;
        }
//        dd($response->json()["list"]);
        return $response->json()["list"][0]["product_id"];
    }


//    Funkcje zmieniające w shoperze


//    Zdjęcia
    public static function getImages($productId): array
    {
        try {
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
        } catch (\Exception $e) {
            sleep(5);
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
            try {
                $response = Http::withoutVerifying()
                    ->withToken(self::getAccessToken())
                    ->asForm()->delete(env('SHOPER_URL') . '/webapi/rest/product-images/' . $productImage["gfx_id"]);
                if ($response->status() === 401) {
                    self::login();
                    return false;
                }

            } catch (\Exception $e) {
                sleep(5);
                return false;
            }
        }
        return true;
    }

    public static function addImages(int $productShoperId, ProductModelColor $productModelColor): bool
    {
        foreach ($productModelColor->images->sortBy("order")->values() as $image) {
            try {
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
            } catch (\Exception $e) {
                sleep(5);
                return false;
            }
        }
        return true;
    }


//    Zmiana ceny
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

    public static function getCategory(string $category): int|null
    {
        $categories = collect(explode("#", $category));
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->get(env('SHOPER_URL') . '/webapi/rest/categories/', [
                    "filters" => json_encode([
                        "translations.pl_PL.name" => ['=' => $categories->last()],
                        "root" => $categories->count() == 1
                    ])
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        } catch (Exception $e) {
            sleep(5);
            return self::getCategory($category);
        }

        if (count($response->json()["list"]) == 0) {
            Log::alert("Cannot find category: " . $category);
            return null;
        }
//        dd($response, $category, $response->body(), $response->json());

        return (int)$response->json()["list"][0]["category_id"];
    }

    public static function getProducer(string $producer): int|null
    {
//        $categories = collect(explode("#", $category));
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->get(env('SHOPER_URL') . '/webapi/rest/producers/', [
                    "filters" => json_encode([
                        "name" => ['=' => $producer],

                    ])
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        } catch (Exception $e) {
            sleep(5);
            return self::getProducer($producer);
        }
        if (count($response->json()["list"]) == 0) {
            Log::alert("Cannot find producer: " . $producer);
            return null;
        }
//        dd($response, $producer, $response->body(), $response->json());
        return (int)$response->json()["list"][0]["producer_id"];
    }

    public static function getOptions(string $option): int|null
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->get(env('SHOPER_URL') . '/webapi/rest/options/', [
//                    "filters" => json_encode([
//                        "name" => ['=' => $producer],
//
//                    ])
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        } catch (Exception $e) {
            sleep(5);
//            return self::getProducer($producer);
        }
//        if (count($response->json()["list"]) == 0) {
//            Log::alert("Cannot find producer: " . $producer);
//            return null;
//        }
        dd($response, $response->body(), $response->json());
        return (int)$response->json()["list"][0]["producer_id"];
    }

    public static function getOptionsValues(int $optionValue): int|null
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->get(env('SHOPER_URL') . '/webapi/rest/option-values/', [
                    "filters" => json_encode([
                        "option_id" => ['=' => $optionValue],

                    ])
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        } catch (Exception $e) {
            sleep(5);
//            return self::getProducer($producer);
        }
//        if (count($response->json()["list"]) == 0) {
//            Log::alert("Cannot find producer: " . $producer);
//            return null;
//        }
        dd($response, $response->body(), $response->json());
        return (int)$response->json()["list"][0]["producer_id"];
    }

    public static function AddProduct(ProductModelColor $productModelColor, int $categoryId, int $producerId): int|null
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/products/', [
                    "category_id" => $categoryId,
                    "code" => $productModelColor->model->symbol . "-" . $productModelColor->shortcut,
                    "producer_id" => $producerId,
                    "stock" => [
                        "price" => $productModelColor->model->prices->retail_gross_price / 100,
                        "stock" => $productModelColor->products()->where("show_in_b2c", true)->sum("quantity"),
                        "delivery_id" => 1 //24h
                    ],
                    "translations" => [
                        "pl_PL" => [
                            "name" => $productModelColor->b2c_name,
                            "active" => true, //true
                        ]
                    ],

                ]);
            if ($response->status() === 401) {
                self::login();
                return self::AddProduct($productModelColor, $categoryId, $producerId);
            }
        } catch (Exception $e) {
            sleep(5);
            return self::AddProduct($productModelColor, $categoryId, $producerId);
        }

//        dd($response, $response->body(), $response->json());
        return $response->json();
    }

    public static function AddProductStock(Product $product, int $shoperProductId): bool
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                    "product_id" => $shoperProductId,
                    "price_type" => 0,
                    "active" => true,
                    "code" => $product->symbol,
                    "ean" => $product->barcodes()->where("main", true)->first(),
                    "stock" => $product->quantity,
                    "options" => [
                        "9" => 0,//Rozmiar
                        "16" => 0,//Kolor
                    ]
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }
        } catch (Exception $e) {
            sleep(5);
            return false;
        }

        dd($response, $response->body(), $response->json());
        return true;
    }


    //Stocki
    public static function getProductStock(): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                "limit" => 50,

                "filters" => json_encode([
                    "extended" => 1,
                    "price_type" => ["!=" => 0]
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json(), $response);
        return $response->json()["list"];
    }

    public static function getProductStockBySymbol(Product $product): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                "filters" => json_encode([
                    "extended" => 1,
                    "code" => $product->symbol
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
        return $response->json()["list"];
    }

    public static function getProductStockAll(int $page): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                "page" => $page,
                "limit" => 50,
                "filters" => json_encode([
                    "extended" => 1,
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return null;
        }
        dd($response->json());
        return $response->json()["list"];
    }

    public static function getProductAll(int $page): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/products/', [
                "page" => $page,
                "limit" => 50,
            ]);
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
        return $response->json()["list"];
    }

    public static function changeStockPrice(int $productStockId): bool
    {
//        (float)$productModelColor->model->prices->retail_gross_price / 100
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/product-stocks/' . $productStockId, [
                "price_type" => 0
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }
        sleep(1);
        return true;
    }

    public static function changeProductStockQuantity(int $productStockId, Product $product): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/product-stocks/' . $productStockId, [
                "stock" => $product->quantity
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }
        sleep(1);
        return true;
    }

    //Zmiana stanu produktu
    public static function changeProductQuantity(int $productId, ProductModelColor $productModelColor): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "stock" => ["stock" => $productModelColor->products()->where("show_in_b2c", true)]
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }


//    Zmiana opisu
    public static function changeDescription(int $productId, ProductModelColor $productModelColor, string $description): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "translations" => [
                    "pl_PL" => [
                        "description" => $description
                    ]
                ]
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }

//    Zamówienia


    public static function getOrder(): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/orders', [
                "limit" => 10,
                "filters" => json_encode([
                    "is_paid" => true,
                    "status.status_id" => 1,
                    "payment_id" => ["!=" => 2],
                ])
            ]);
        if ($response->status() === 401) {
            self::login();
            return false;
        }


        $responseCashOnDelivery = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/orders', [
                "limit" => 10,
                "order" => "order_id",
                "filters" => json_encode([
                    "is_paid" => false,
                    "status.status_id" => 1,
                    "payment_id" => ["=" => 2],
                ])
            ]);
        if ($responseCashOnDelivery->status() === 401) {
            self::login();
            return false;
        }

        $shoperOrders = array_merge($response->json()["list"], $responseCashOnDelivery->json()["list"]);

        foreach ($shoperOrders as $shoperOrder) {
            $responseProducts = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/order-products/', [
                    "limit" => 50,
                    "filters" => json_encode([
                        "order_id" => ['=' => $shoperOrder["order_id"]],
                    ]),
                ]);
            if ($responseProducts->status() === 401) {
                self::login();
                return false;
            }

            if (!isset($shoperOrder["payment_additional_fields"])) {
                $responsePayment = Http::withoutVerifying()
                    ->withToken(self::getAccessToken())
                    ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/payments/' . $shoperOrder["payment_id"]);
                if ($responseProducts->status() === 401) {
                    self::login();
                    return false;
                }

                $paymentName = $responsePayment->json()["translations"]["pl_PL"]["title"];
            } else {
                $paymentName = $shoperOrder["payment_additional_fields"]["external_payment"];

            }


            $responseShipping = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/shippings/' . $shoperOrder["shipping_id"]);
            if ($responseProducts->status() === 401) {
                self::login();
                return false;
            }
            $shippingName = $responseShipping->json()["name"];

            $shoperOrderProducts = $responseProducts->json()["list"];

            $shoperOrderModel = ShoperOrder::create([
                "order_id" => $shoperOrder["order_id"],
                "ordered_at" => $shoperOrder["date"],
                "sum" => $shoperOrder["sum"],
                "payment_name" => $paymentName,
                "shiping_name" => $shippingName,
                "shipping_cost" => $shoperOrder["shipping_cost"],
                "promo_code" => $shoperOrder["promo_code"],
                "email" => $shoperOrder["email"],
                "firstname" => $shoperOrder["billing_address"]["firstname"],
                "lastname" => $shoperOrder["billing_address"]["lastname"],
                "company" => $shoperOrder["billing_address"]["company"],
                "city" => $shoperOrder["billing_address"]["city"],
                "postcode" => $shoperOrder["billing_address"]["postcode"],
                "street1" => $shoperOrder["billing_address"]["street1"],
                "country" => $shoperOrder["billing_address"]["country"],
                "phone" => $shoperOrder["billing_address"]["phone"],
                "tax_id" => $shoperOrder["billing_address"]["tax_identification_number"],
                "subiekt_number" => "",
                "subiekt_added_at" => null
            ]);
            foreach ($shoperOrderProducts as $shoperOrderProduct) {
                $shoperOrderModel->shoperOrderProducts()->create([
                    'code' => $shoperOrderProduct["code"],
                    'quantity' => $shoperOrderProduct["quantity"],
                    'price' => $shoperOrderProduct["price"],
                ]);
            }

            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->put(env('SHOPER_URL') . '/webapi/rest/orders/' . $shoperOrder["order_id"], [
                    "status_id" => 2
                ]);
            if ($response->status() === 401) {
                self::login();
                return false;
            }


        }

        return true;


    }

}
