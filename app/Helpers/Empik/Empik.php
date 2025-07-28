<?php

namespace App\Helpers\Empik;

use App\Jobs\Empik\EmpikAcceptOrder;
use App\Jobs\Quantity\ChangeQuantity;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\SimpleExcel\SimpleExcelWriter;

class Empik
{

    public static function login()
    {

    }

    public static function createProductsCsv(Collection $products): string
    {
        $rows = collect([]);

        foreach ($products as $productToEmpik) {
            $images = $productToEmpik->images()->where("type", 1)->get()->sortBy("order")->values();
            $images = $images->map(function ($image) {
                return str_replace("test", "pl", route("images.1x1", ["slug" => $image->slug]));
            });

            $productModel = $productToEmpik->model;

            $rows->push([
                "STR_GOLD" => $productModel->empikCategory->name,//Kategoria Empik
                "CATALOG_CODE" => $productToEmpik->symbol,//Numer katalogowy
                "PELNY_TYTUL" => $productToEmpik->name_b2c,//Pełny tytuł
                "OPIS_PRODUKTU_PELNY" => $productModel->description_b2c,//Opis produktu;
                "EAN" => $productToEmpik->barcodes()->where("main", 1)->first()->barcode,//EAN
                "VAT_VALUE" => $productModel->prices->vat_rate . "%",//VAT

                "ZDJECIE_OKLADKI_PRZOD_DUZY" => $images[0] ?? "",//Zdjęcie Główne
                "DODATKOWE_ZDJECIA_1" => $images[1] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_2" => $images[2] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_3" => $images[3] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_4" => $images[4] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_5" => $images[5] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_6" => $images[6] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_7" => $images[7] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_8" => $images[8] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_9" => $images[9] ?? "",//Dodatkowe zdjęcia
                "DODATKOWE_ZDJECIA_10" => $images[10] ?? "",//Dodatkowe zdjęcia

                "600" => $productModel->brand->name,//Producent
                "34" => $productModel->brand->name,//Marka
                "2205" => $productToEmpik->size->name,//Rozmiar-wartość
                "2502" => $productToEmpik->size->name,//Rozmiar obuwia
                "254" => $productModel->clasp->value,//Zapięcie
            ]);
        }

        $path = storage_path("app/empik/EmpikProducts.csv");
        $writer = SimpleExcelWriter::create($path, delimiter: ';')
            ->addRows($rows);
        $writer->close();

        return $path;
    }


    public static function updateProducts(string $path): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
//        dd($path, file_get_contents($path));
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
//            ->contentType("application/json")
            ->asMultipart()
            ->attach("file", file_get_contents($path), "EmpikProducts.csv")
            ->post(config("services.empik.api_uri") . "/products/imports", [
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik update products error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

//    public static function listAllProducts(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
//    {
//        $response = Http::withoutVerifying()
//            ->withToken(config("services.empik.api_key"), "")
//            ->accept("application/json")
//            ->contentType("application/json")
//            ->get(config("services.empik.api_uri") . "/offers", [
//                "max" => 100,
//                //"offset"=>0,
//                //"sort"=>"id",
//                //"order"=>"asc",
//            ]);
//        if (!$response->successful()) {
//            throw new \RuntimeException("Empik list offers error " . $response->status() . " " . json_encode($response->json()));
//        }
////        dd($response, $response->status(), $response->json());
//        return $response;
//    }

//    public static function searchProduct(Product $product): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
//    {
//        $response = Http::withoutVerifying()
//            ->withToken(config("services.empik.api_key"), "")
//            ->accept("application/json")
//            ->contentType("application/json")
//            ->get(config("services.empik.api_uri") . "/offers", [
//                "sku" => $product->symbol,
////                "max" => 100,
//                //"offset"=>0,
//                //"sort"=>"id",
//                //"order"=>"asc",
//            ]);
//        if (!$response->successful()) {
//            throw new \RuntimeException("Empik search offer error " . $response->status() . " " . json_encode($response->json()));
//        }
////        dd($response, $response->status(), $response->json());
//        return $response;
//    }

    public static function updateOffers(Collection $products): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $offers = $products->map(function ($product) {
            return [
                "product_id" => $product->barcodes()->where("main", 1)->first()->barcode,
                "product_id_type" => "EAN",

                "shop_sku" => $product->symbol,
                "price" => (string)($product->model->prices->b2c_gross_price / 100),
                "quantity" => $product->available_b2c,

                "logistic_class" => "1", //1 - mała
                "leadtime_to_ship" => "1", //1 dzien realizacji
                "state_code" => "11",//nowe

//                "update_delete" => "update",// "update" or "delete".
            ];
        });


        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->post(config("services.empik.api_uri") . "/offers", [
                "offers" => $offers,
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik update/create offer error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json(), $offers);
        return $response;
    }


    public static function listNewOrders(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/orders", [
                "sort" => "dateCreated",
                "order" => "asc",
                "order_state_codes" => "WAITING_ACCEPTANCE",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik search new orders error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function listReadyOrders(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/orders", [
                "sort" => "dateCreated",
                "order" => "asc",
                "order_state_codes" => "SHIPPING",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik search ready orders error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function getReadyOrder($orderId)
    {
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->get(config("services.empik.api_uri") . "/orders", [
                "sort" => "dateCreated",
                "order" => "asc",
                "order_state_codes" => "SHIPPING",
                "order_ids" => $orderId,
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik search ready order error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function acceptOrder(string $orderId, Collection $orderItems): bool
    {
//        dd($orderId, $orderItems);
        $orderLines = $orderItems->map(function ($orderItem) {
            return [
                "accepted" => "true",
                "id" => $orderItem->order_line_id,
            ];
        });
        $response = Http::withoutVerifying()
            ->withToken(config("services.empik.api_key"), "")
            ->accept("application/json")
            ->contentType("application/json")
            ->put(config("services.empik.api_uri") . "/orders/{$orderId}/accept", [
                "order_lines" => $orderLines
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Empik accept order error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
//        return $response;

        if ($response->successful()) {
            return true;
        }
        return false;
    }


//    public static function acceptOrders()
//    {
//        $response = self::listNewOrders();
//        $empikOrders = $response->json()["orders"];
//        foreach ($empikOrders as $empikOrder) {
//            $empikOrderObject = json_decode(json_encode($empikOrder));
//            $empikOrderItemsObject = collect($empikOrderObject->order_lines);
//
////            dd($empikOrderObject);
//            $response = self::acceptOrder($empikOrderObject->order_id, $empikOrderItemsObject);
//            if ($response->successful()) {
//            }
//            dd($response, $response->status(), $response->json());
//        }
//    }

    /**
     * @throws \Exception
     */
    public static function getOrders(): bool
    {
        $response = self::listNewOrders();
//        $response = self::listReadyOrders();

        $empikOrders = $response->json()["orders"];
        foreach ($empikOrders as $empikOrder) {

            $empikOrderObject = json_decode(json_encode($empikOrder));
            $empikOrderItemsObject = collect($empikOrderObject->order_lines);

            if (Order::query()->where("type", 3)->where("order_id", $empikOrderObject->order_id)->count() > 0) continue;

            $lastOrder = Order::query()->where("type", 3)->latest()->first();
            $lastNumber = $lastOrder?->number ?? 0;
            $lastNumber = (int)substr($lastNumber, -5);
            $lastNumber++;
            $number = "EMP " . str_pad($lastNumber, 5, "0", STR_PAD_LEFT);

            $email = collect(json_decode(json_encode($empikOrderObject->order_additional_fields)))->filter(function ($item) {
                return $item->code === "customer-emai";
            })->first()?->value;
            if (is_null($email)) {
                $email = $empikOrderObject->customer_notification_email;
            }
//            dd($empikOrderObject, $empikOrderItemsObject);

            $empikOrderModel = Order::create([
                "number" => $number,
                "type" => 3,
                "status" => 1,//1 - nowe, 20 - zrealizowane
                "order_id" => $empikOrderObject->order_id,
                "ordered_at" => Carbon::parse($empikOrderObject->created_date)->setTimezone("Europe/Warsaw")->toDateTimeString(),
                "total_quantity" => $empikOrderItemsObject->sum("quantity"),
                "total_gross" => $empikOrderItemsObject->sum("price"),
                "payment_name" => $empikOrderObject->paymentType,
                "delivery_name" => $empikOrderObject->shipping_type_label,
                "delivery_gross" => $empikOrderObject->shipping_price,
                "promo_code" => null,

                "email" => $email,
                "login" => $empikOrderObject->customer->customer_id,
                "firstname" => Str::title($empikOrderObject->customer->firstname),
                "lastname" => Str::title($empikOrderObject->customer->lastname),

                "company" => "",
                "city" => "",
                "postcode" => "",
                "street1" => "",
                "country" => "",
                "phone" => "",
                "tax_id" => "",
                "comment" => null,
            ]);


            foreach ($empikOrderItemsObject as $item) {
                $code = $item->offer_sku;
                $originalCode = $item->offer_sku;
                $productVariant = false;


                if (Str::contains($code, "#")) {
                    $code = explode("#", $code)[0];
                    $productVariant = true;
                }

                $product = Product::query()->where("symbol", $code)->first();

                $orderProduct = new OrderProduct([
                    'quantity' => $item->quantity,
                    'price' => $item->price / $item->quantity,
                    'discounted_price' => $item->price / $item->quantity,
                ]);

                if (is_null($product)) {
                    $orderProduct->product_code = $code;
                } else if ($productVariant) {
                    $orderProduct->product_id = $product->id;
                    $orderProduct->product_code = $originalCode;
                } else {
                    $orderProduct->product_id = $product->id;
                }

                $empikOrderModel->orderProducts()->save($orderProduct);

                if (!is_null($product)) {
                    ChangeQuantity::dispatch($product);
                }
            }
            EmpikAcceptOrder::dispatch($empikOrderModel, $empikOrderItemsObject);

        }
        return true;

    }

}
