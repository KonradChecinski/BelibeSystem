<?php

namespace App\Helpers\Allegro;

use App\Jobs\Quantity\ChangeQuantity;
use App\Models\AllegroToken;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class Allegro
{
    private static function getToken()
    {
        return AllegroToken::query()->latest()->first()?->access_token;
    }

    public static function listOffers(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {

        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/sale/offers");
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro list order error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function searchOffer(Product $product): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {

        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/sale/offers", [
                    "external.id" => $product->symbol,
                ]
            );
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro search order error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function changeQuantityInOffer(int $allegroId, Product $product): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $commandId = Str::uuid();

        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->contentType("application/vnd.allegro.public.v1+json")
            ->put(config("services.allegro.api_uri") . "/sale/offer-quantity-change-commands/{$commandId}", [
                    "modification" => array(
                        "changeType" => "FIXED",
                        "value" => $product->available_b2c
                    ),
                    "offerCriteria" => array(
                        array(
                            "type" => "CONTAINS_OFFERS",
                            "offers" => array(
                                array(
                                    "id" => $allegroId
                                )
                            )
                        )
                    )
                ]
            );
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro change quantity error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function changeStatusInOffer(int $allegroId, bool $active = true): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->contentType("application/vnd.allegro.public.v1+json")
            ->patch(config("services.allegro.api_uri") . "/sale/product-offers/{$allegroId}", [
                "publication" => [
                    "status" => $active ? "ACTIVE" : "ENDED"
                ]
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro change status error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function listOrders(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/order/checkout-forms", [
                "status" => "READY_FOR_PROCESSING",
                "fulfillment.status" => "NEW",
                "sort" => "lineItems.boughtAt",
            ]);
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro list order error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }


    public static function changeOrderStatus($orderId): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->contentType("application/vnd.allegro.public.v1+json")
            ->put(config("services.allegro.api_uri") . "/order/checkout-forms/{$orderId}/fulfillment", [
                "status" => "PROCESSING",
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException("Allegro change order status error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());

        return true;
    }


    /**
     * @throws \Exception
     */
    public static function getOrders(): bool
    {
        $response = self::listOrders();

        $allegroOrders = $response->json()["checkoutForms"];
        foreach ($allegroOrders as $allegroOrder) {

            $allegroOrderObject = json_decode(json_encode($allegroOrder));
            $allegroOrderItemsObject = collect($allegroOrderObject->lineItems);

            $lastOrder = Order::query()->where("type", 2)->latest()->first();
            $lastNumber = $lastOrder?->number ?? 0;
            $lastNumber = (int)substr($lastNumber, -5);
            $lastNumber++;
            $number = "ALL " . str_pad($lastNumber, 5, "0", STR_PAD_LEFT);


            $allegroOrderModel = Order::create([
                "number" => $number,
                "type" => 2,
                "status" => 20,
                "order_id" => $allegroOrderObject->id,
                "ordered_at" => Carbon::parse($allegroOrderObject->lineItems[0]->boughtAt)->setTimezone("Europe/Warsaw"),
                "total_quantity" => $allegroOrderItemsObject->sum("quantity"),
                "total_gross" => $allegroOrderItemsObject->sum(fn($item) => $item->price->amount * $item->quantity),
                "payment_name" => $allegroOrderObject->payment->provider,
                "delivery_name" => $allegroOrderObject->delivery->method->name,
                "delivery_gross" => $allegroOrderObject->delivery->cost->amount,
                "smart" => $allegroOrderObject->delivery->smart,
                "promo_code" => null,
                "email" => $allegroOrderObject->buyer->email,
                "login" => $allegroOrderObject->buyer->login,
                "firstname" => Str::title($allegroOrderObject->buyer->firstName),
                "lastname" => Str::title($allegroOrderObject->buyer->lastName),
                "company" => Str::title($allegroOrderObject->buyer->companyName),
                "city" => Str::title($allegroOrderObject->buyer->address->city),
                "postcode" => $allegroOrderObject->buyer->address->postCode,
                "street1" => Str::title($allegroOrderObject->buyer->address->street),
                "country" => Str::title($allegroOrderObject->buyer->address->countryCode),
                "phone" => $allegroOrderObject->buyer->phoneNumber,
                "tax_id" => $allegroOrderObject->invoice->address?->company?->ids[0]->value,
                "comment" => $allegroOrderObject->messageToSeller === "" ? null : Str::ascii($allegroOrderObject->messageToSeller),
            ]);

            foreach ($allegroOrderItemsObject as $item) {
                $code = $item->offer->external->id;
                $originalCode = $item->offer->external->id;
                $productVariant = false;


                if (Str::contains($code, "#")) {
                    $code = explode("#", $code)[0];
                    $productVariant = true;
                }

                $product = Product::query()->where("symbol", $code)->first();

                $orderProduct = new OrderProduct([
                    'quantity' => $item->quantity,
                    'price' => $item->originalPrice->amount,
                    'discounted_price' => $item->price->amount,
                ]);

                if (is_null($product)) {
                    $orderProduct->product_code = $code;
                } else if ($productVariant) {
                    $orderProduct->product_id = $product->id;
                    $orderProduct->product_code = $originalCode;
                } else {
                    $orderProduct->product_id = $product->id;
                }

                $allegroOrderModel->orderProducts()->save($orderProduct);

                if (!is_null($product)) {
                    ChangeQuantity::dispatch($product);
                }
            }
            self::changeOrderStatus($allegroOrderModel->order_id);
        }
        return true;

    }

    //MESSAGES
    public static function getMessThreads(): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/messaging/threads");
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro message threads list error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function getMessThreadMessList(string $threadId): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->get(config("services.allegro.api_uri") . "/messaging/threads/$threadId/messages");
        if (!$response->successful()) {
            throw new \RuntimeException("Allegro messages list of message thread error " . $response->status() . " " . json_encode($response->json()));
        }
        dd($response, $response->status(), $response->json());
        return $response;
    }

    public static function changeMessThreadStatus(string $threadId): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->contentType("application/vnd.allegro.public.v1+json")
            ->put(config("services.allegro.api_uri") . "/messaging/threads/{$threadId}/read", [
                "read" => "true",
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException("Allegro message thread put read error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());

        return true;
    }

    public static function sendMessInMessThread(string $threadId, $message): bool
    {
        $response = Http::withoutVerifying()
            ->withToken(self::getToken())
            ->accept("application/vnd.allegro.public.v1+json")
            ->contentType("application/vnd.allegro.public.v1+json")
            ->post(config("services.allegro.api_uri") . "/messaging/threads/{$threadId}/messages", [
                "text" => $message,
                "attachments" => []
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException("Allegro send message error " . $response->status() . " " . json_encode($response->json()));
        }
//        dd($response, $response->status(), $response->json());

        return true;
    }

}
