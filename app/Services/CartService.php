<?php

namespace App\Services;

use App\Events\CartProductUpdated;
use App\Events\CartSummaryUpdated;
use App\Events\CartUpdated;
use App\Helpers\Helper;
use App\Models\B2bCart;
use App\Models\Client\Client;
use App\Models\ClientOrderProductEdit;
use App\Models\Products\Product;

class CartService
{
    public function addOrUpdateProduct(Client $client, Product $product, int $quantity)
    {
        // logika dodawania/aktualizacji produktu w koszyku
        if (Helper::isOrderToEdit()) {
//            $clientOrder = Helper::getClientOrderToEditToB2b();
            $clientOrderId = Helper::getClientOrderIdToEditToB2b();

            if (Helper::getClientOrderProductToEdit($clientOrderId)->where("product_id", $product->id)->count() === 0) {
                $discountedPrices = $product->model->priceForClientB2b($client);
                $prices = $product->model->prices;
                $currency = $prices->currency;

//            dd($request->all(), $discountedPrices, $discountedPrices['show_discount_on_invoice'], $prices);
                $cartProduct = new ClientOrderProductEdit([
                    "client_order_id" => $clientOrderId,
                    "product_id" => $product->id,
                    "quantity" => $quantity,
                    'original_price_net' => $discountedPrices['show_discount_on_invoice'] ? $prices['wholesale_net_price'] : $discountedPrices['discounted_wholesale_net_price'],
                    'price_net' => $discountedPrices['discounted_wholesale_net_price'],
                    'vat_rate' => $discountedPrices['vat_rate'],
                    'currency' => $currency,
                ]);
                $cartProduct->save();

//                $cartProduct->product()->associate($product);
//            dd($cartProduct->toArray());
//                $client->cart()->save($cartProduct);
            } else {
                if ($quantity == 0) {
                    Helper::getClientOrderProductToEdit($clientOrderId)->where("product_id", $product->id)->delete();
                } else {
                    $cartProduct = Helper::getClientOrderProductToEdit($clientOrderId)->where("product_id", $product->id)->first();
                    $cartProduct->quantity = $quantity;
                    $cartProduct->save();
                }

            }

        } else {
            if ($client->cart()->where("product_id", $product->id)->count() == 0) {
                if ($quantity == 0) {
                    return;
                }
                $discountedPrices = $product->model->priceForClientB2b($client);
                $prices = $product->model->prices;
                $currency = $prices->currency;

//            dd($request->all(), $discountedPrices, $discountedPrices['show_discount_on_invoice'], $prices);
                $cartProduct = new B2bCart([
                    "quantity" => $quantity,
                    'original_price_net' => $discountedPrices['show_discount_on_invoice'] ? $prices['wholesale_net_price'] : $discountedPrices['discounted_wholesale_net_price'],
                    'price_net' => $discountedPrices['discounted_wholesale_net_price'],
                    'vat_rate' => $discountedPrices['vat_rate'],
                    'currency' => $currency,
                ]);

                $cartProduct->product()->associate($product);
//            dd($cartProduct->toArray());
                $client->cart()->save($cartProduct);
            } else {
                if ($quantity == 0) {
                    $client->cart()->where("product_id", $product->id)->delete();
                } else {
                    $cartProduct = $client->cart()->where("product_id", $product->id)->first();
                    $cartProduct->quantity = $quantity;
                    $cartProduct->save();
                }

            }
            CartUpdated::dispatch($client->id);
            CartSummaryUpdated::dispatch($client->id);
            CartProductUpdated::dispatch($client->id, $product->id, $quantity);
        }
    }

    public function clearCart(): void
    {
        if (Helper::isOrderToEdit()) {
            $clientOrderId = Helper::getClientOrderIdToEditToB2b();
            Helper::getClientOrderProductToEdit($clientOrderId)->delete();
        } else {
            $client = Helper::getClientToB2b();
            $client->cart()->delete();
        }
    }
}
