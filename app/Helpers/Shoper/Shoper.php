<?php

namespace App\Helpers\Shoper;

use App\Jobs\Quantity\ChangeQuantity;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\ShoperOrder;
use App\Models\ShoperToken;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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
        if ($response->status() === 429) {
            sleep(1);
            return self::findIdColor($productModelColor);
        }
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

    public static function findIdsColor(ProductModelColor $productModelColor): array|null
    {
        $code = $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut;
        $code .= "%";

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/products', [
                "limit" => 50,
                "filters" => json_encode([
                    "stock.code" => ['LIKE' => $code],
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::findsIdColor($productModelColor);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
        if ($response->json()["count"] == 0) {
            Log::alert($productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut . " not find in shoper");
            return null;
        }
//        dd($response->json()["list"], $code);
        return collect($response->json()["list"])->unique('product_id')->pluck('product_id')->toArray();
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
            if ($response->status() === 429) {
                sleep(1);
                return self::getImages($productId);
            }
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
                if ($response->status() === 429) {
                    sleep(1);
                    return self::deleteImages($productId);
                }
                if ($response->status() === 401) {
                    self::login();
                    return false;
                }

            } catch (\Exception $e) {
                sleep(5);
                self::deleteImages($productId);
                return false;
            }
        }
        return true;
    }

    public static function addImages(int $productShoperId, ProductModelColor $productModelColor): bool
    {
        foreach ($productModelColor->images->where("type", 1)->sortBy("order")->values() as $image) {
            try {
                $response = Http::withoutVerifying()
                    ->withToken(self::getAccessToken())
                    ->post(env('SHOPER_URL') . '/webapi/rest/product-images', [
                        "product_id" => $productShoperId,
                        "url" => str_replace("test", "pl", route("images", ['path' => $image->path])),
                        "translations" => [
                            "pl_PL" => [
                                "name" => $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut
                            ]
                        ]
                    ]);
                if ($response->status() === 429) {
                    sleep(1);
                    self::deleteImages($productShoperId);
                    return self::addImages($productShoperId, $productModelColor);
                }
                if ($response->status() === 401) {
                    self::login();
                    return self::addImages($productShoperId, $productModelColor);
                }
                if ($response->status() !== 200) {
                    sleep(1);
                    self::deleteImages($productShoperId);
                    return self::addImages($productShoperId, $productModelColor);
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
        if ($response->status() === 429) {
            sleep(1);
            return self::changePrice($productId, $productModelColor);
        }
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
            if ($response->status() === 429) {
                sleep(1);
                return self::getCategory($category);
            }
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
            if ($response->status() === 429) {
                sleep(1);
                return self::getProducer($producer);
            }
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
            if ($response->status() === 429) {
                sleep(1);
                return self::getOptions($option);
            }
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

    public static function getOptionsValues(int $optionValue, int $page): array
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->get(env('SHOPER_URL') . '/webapi/rest/option-values/', [
                    "limit" => 50,
                    "page" => $page,
                    "filters" => json_encode([
                        "option_id" => ['=' => $optionValue],
                    ])
                ]);
            if ($response->status() === 429) {
                sleep(1);
                return self::getOptionsValues($optionValue);
            }
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
//        dd($response, $response->body(), $response->json(), $response->status());
        return $response->json()["list"];
    }

    public static function getOptionsValue(int $optionValue, string $name): int|null
    {
        $values = collect();
        $page = 1;
        while (count($optionsValues = self::getOptionsValues($optionValue, $page++)) != 0) {
            $values = $values->merge($optionsValues);
        }
        $optionsValue = $values->where("translations.pl_PL.value", $name);
        if ($optionsValue->count() == 0) {
            return null;
        }
        $optionsValueId = $optionsValue->first()["ovalue_id"];

        return (int)$optionsValueId;
    }

    public static function AddOptionsValue(int $optionValue, string $name): int|null
    {
        try {
            if ($optionValue == 16 || $optionValue == 8) {
                $option = [
                    'option_id' => $optionValue,
                    'color' => 'transparent',
                    'translations' => [
                        'pl_PL' => [
                            'value' => $name
                        ]
                    ],
                ];
            } else {
                $option = [
                    'option_id' => $optionValue,
                    'translations' => [
                        'pl_PL' => [
                            'value' => $name
                        ]
                    ],
                ];
            }
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/option-values/', $option);
            if ($response->status() === 429) {
                sleep(1);
                return self::AddOptionsValue($optionValue, $name);
            }
            if ($response->status() === 401) {
                self::login();
                return self::AddOptionsValue($optionValue, $name);
            }
        } catch (Exception $e) {
            sleep(5);
            return self::AddOptionsValue($optionValue, $name);
        }

//        dd($response, $response->body(), $response->json());
        return (int)$response->json();
    }

    public static function AddProduct(ProductModelColor $productModelColor, int $categoryId, int $producerId): int|null
    {
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/products/', [
                    "category_id" => $categoryId,
                    "code" => $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut,
                    "producer_id" => $producerId,
                    "stock" => [
                        "price" => $productModelColor->model->prices->retail_gross_price / 100,
                        "stock" => $productModelColor->products()->where("show_in_b2c", true)->sum("quantity"),
                        "delivery_id" => 1 //24h
                    ],
                    "translations" => [
                        "pl_PL" => [
                            "name" => $productModelColor->b2c_product_name,
                            "active" => true, //true
                        ]
                    ],

                ]);
            if ($response->status() === 429) {
                sleep(1);
                return self::AddProduct($productModelColor, $categoryId, $producerId);
            }
            if ($response->status() === 401) {
                self::login();
                return self::AddProduct($productModelColor, $categoryId, $producerId);
            }
        } catch (Exception $e) {
            sleep(5);
            return self::AddProduct($productModelColor, $categoryId, $producerId);
        }
        self::addImages($response->json(), $productModelColor);
//        dd($response, $response->body(), $response->json());
        return $response->json();
    }

    public static function AddProductStock(Product $product, int $shoperProductId, array $options): int|null
    {
        $productSymbol = $product->symbol == $product->color->model->symbol . "-" . $product->color->b2c_shortcut ? $product->symbol . "." : $product->symbol;
        try {
            $response = Http::withoutVerifying()
                ->withToken(self::getAccessToken())
                ->post(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                    "product_id" => $shoperProductId,
                    "price_type" => 0,
                    "active" => true,
                    "code" => $productSymbol,
                    "ean" => $product->barcodes()->where("main", true)->first()->barcode,
                    "stock" => $product->quantity,
                    "delivery_id" => 1, //24h
                    "options" => $options
                ]);
            if ($response->status() === 429) {
                sleep(1);
                return self::AddProductStock($product, $shoperProductId, $options);
            }
            if ($response->status() === 401) {
                self::login();
                return null;
            }
        } catch (Exception $e) {
            sleep(5);
            return self::AddProductStock($product, $shoperProductId, $options);
        }

        return (int)$response->json();
    }

    public static function AddProductVariant(Product $product, int $shoperProductId): int|null
    {
//        dd($product->size->name, $product->color->b2cColor->name);
        $shoperSize = 0;
        $shoperColor = 0;

        if ($product->model->b2c_variant == 1) {

            //dla 6 - Zestaw rozmiar
            $shoperSize = self::getOptionsValue(9, $product->size->name); //Rozmiar
            if (is_null($shoperSize)) $shoperSize = self::addOptionsValue(9, $product->size->name);

            $shoperColor = self::getOptionsValue(16, $product->color->b2cColor->name); //Kolor
            if (is_null($shoperColor)) $shoperColor = self::addOptionsValue(16, $product->color->b2cColor->name);

            $options = [
                "9" => $shoperSize,//Rozmiar
                "16" => $shoperColor,//Kolor
            ];
        } else if ($product->model->b2c_variant == 2) {

            //dla 5 - Zestaw kolor
            $shoperColor = self::getOptionsValue(8, $product->color->b2cColor->name); //Kolor
            if (is_null($shoperColor)) $shoperColor = self::addOptionsValue(8, $product->color->b2cColor->name);

            $options = [
                "8" => $shoperColor,//Kolor
            ];

        } else {
            return null;
        }
//        dd($options, $product->color->b2cColor->name);
        return (int)self::AddProductStock($product, $shoperProductId, $options);
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
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductStock();
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json(), $response);
        return $response->json()["list"];
    }

    public static function getProductsStockBySymbol(Product $product): array|null
    {
        $code = $product->symbol == $product->color->model->symbol . "-" . $product->color->b2c_shortcut ? $product->symbol . "." : $product->symbol;
        $code .= "%";

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                "filters" => json_encode([
                    "extended" => 1,
                    "code" => ['LIKE' => $code],
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductsStockBySymbol($product);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
        return $response->json()["list"];
    }

    public static function getProductStockBySymbol(Product $product): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/product-stocks/', [
                "filters" => json_encode([
                    "extended" => 1,
                    "code" => $product->symbol == $product->color->model->symbol . "-" . $product->color->b2c_shortcut ? $product->symbol . "." : $product->symbol,
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductStockBySymbol($product);
        }
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
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductStockAll($page);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
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

        if ($response->status() === 429) {
            sleep(1);
            return self::getProductAll($page);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json(), $response->status());
        return $response->json()["list"];
    }

    public static function getProductsBySymbol(ProductModelColor $productModelColor): array|null
    {
        $code = $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut;
        $code .= "%";

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/products/', [
                "limit" => 50,
                "filters" => json_encode([
                    "stock.code" => ['LIKE' => $code],
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductsBySymbol($productModelColor);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
        return collect($response->json()["list"])->unique('product_id')->values()->toArray();
    }

    public static function getProductBySymbol(ProductModelColor $productModelColor): array|null
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->get(env('SHOPER_URL') . '/webapi/rest/products/', [
                "limit" => 50,
                "filters" => json_encode([
                    "stock.code" => $productModelColor->model->symbol . "-" . $productModelColor->b2c_shortcut,
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::getProductBySymbol($productModelColor);
        }
        if ($response->status() === 401) {
            self::login();
            return null;
        }
//        dd($response->json());
        return collect($response->json()["list"])->unique('product_id')->values()->toArray();
    }

    public static function changeStockActive(int $productStockId, bool $active): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/product-stocks/' . $productStockId, [
                "active" => $active
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeStockActive($productStockId, $active);
        }
        if ($response->status() === 401) {
            self::login();
            return false;
        }
        sleep(1);
        return true;
    }

    public static function changeProductActive(int $productId, bool $active): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "translations" => [
                    "pl_PL" => [
                        "active" => $active
                    ]
                ]
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeStockActive($productId, $active);
        }
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }

    public static function changeStockPrice(int $productStockId): bool
    {
//        (float)$productModelColor->model->prices->retail_gross_price / 100
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/product-stocks/' . $productStockId, [
                "price_type" => 0
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeStockPrice($productStockId);
        }
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
                "stock" => $product->available
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeProductStockQuantity($productStockId, $product);
        }
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
        $products = $productModelColor->products()->where("show_in_b2c", true)->get();
        $available = $products->sum("available");

        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "stock" => ["stock" => $available]
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeProductQuantity($productId, $productModelColor);
        }
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
        if ($response->status() === 429) {
            sleep(1);
            return self::changeDescription($productId, $productModelColor, $description);
        }
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }

    //    Zmiana nazwy
    public static function changeName(int $productId, string $name): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/products/' . $productId, [
                "translations" => [
                    "pl_PL" => [
                        "name" => $name
                    ]
                ]
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeName($productId, $name);
        }
        if ($response->status() === 401) {
            self::login();
            return false;
        }

        return true;
    }

//    Zamówienia

    public static function changeOrderStatus($orderId): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->put(env('SHOPER_URL') . '/webapi/rest/orders/' . $orderId, [
                "status_id" => 2
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::changeOrderStatus($orderId);
        }
        if ($response->status() === 401) {
            self::login();
            return false;
        }
        return true;
    }

    public static function getOrders(): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getAccessToken())
            ->asForm()->get(env('SHOPER_URL') . '/webapi/rest/orders', [
                "limit" => 10,
                "filters" => json_encode([
                    "is_paid" => true,
                    "status.status_id" => 1,
                    "payment_id" => ["NOT IN" => [1, 2]],
                ])
            ]);
        if ($response->status() === 429) {
            sleep(1);
            return self::getOrder();
        }
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
                    "payment_id" => ["IN" => [1, 2]],
                ])
            ]);
        if ($responseCashOnDelivery->status() === 401) {
            self::login();
            return false;
        }

        $shoperOrders = array_merge($response->json()["list"], $responseCashOnDelivery->json()["list"]);
//        dd($shoperOrders);
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

            $lastOrder = Order::query()->where("type", 1)->latest()->first();
            $lastNumber = $lastOrder->number ?? 0;
            $lastNumber = (int)substr($lastNumber, -5);
            $lastNumber++;
            $number = "SHP " . str_pad($lastNumber, 5, "0", STR_PAD_LEFT);

            $shoperOrderModel = Order::create([
                "number" => $number,
                "type" => 1,
                "status" => 2,
                "order_id" => $shoperOrder["order_id"],
                "ordered_at" => $shoperOrder["date"],
                "total_quantity" => count($shoperOrderProducts),
                "total_gross" => $shoperOrder["sum"],
                "payment_name" => $paymentName,
                "delivery_name" => $shippingName,
                "delivery_gross" => $shoperOrder["shipping_cost"],
                "promo_code" => $shoperOrder["promo_code"] === "" ? null : $shoperOrder["promo_code"],
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
            ]);

            foreach ($shoperOrderProducts as $shoperOrderProduct) {
                $code = $shoperOrderProduct["code"];
                $originalCode = $shoperOrderProduct["code"];
                $productVariant = false;

                if (substr($code, -1) === ".") {
                    $code = substr($code, 0, -1);
                }


                if (Str::contains($code, "#")) {
                    $code = explode("#", $code)[0];
                    $productVariant = true;
                }


                $product = Product::query()->where("symbol", $code)->first();

                $orderProduct = new OrderProduct([
                    'quantity' => $shoperOrderProduct["quantity"],
                    'price' => $shoperOrderProduct["price"],
                    'discounted_price' => $shoperOrderProduct["price"] - ($shoperOrderProduct["price"] * $shoperOrderProduct["discount_perc"] / 100),
                ]);

                if (is_null($product)) {
                    $orderProduct->product_code = $code;
                } else if ($productVariant) {
                    $orderProduct->product_id = $product->id;
                    $orderProduct->product_code = $originalCode;
                } else {
                    $orderProduct->product_id = $product->id;
                }

                $shoperOrderModel->orderProducts()->save($orderProduct);

                if (!is_null($product)) {
                    ChangeQuantity::dispatch($product);
                }
            }

            self::changeOrderStatus($shoperOrder["order_id"]);

        }

        return true;


    }

}
