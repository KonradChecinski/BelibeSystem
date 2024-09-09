<?php

namespace App\Helpers\Prices;

use App\Models\Client\Client;
use App\Models\Products\ProductModel;

class Price
{
    public static function showClientPrices(ProductModel $productModel, Client $client): array
    {
        $price = [
            ...$productModel->prices->toArray(),
            ...$productModel->priceForClientB2b($client),
        ];

        $priceForClient = [
            'price_net' => $price['discounted_wholesale_net_price'],
            'price_gross' => $price['discounted_wholesale_gross_price'],
            'vat_rate' => $price['vat_rate'],
            'currency' => $price['currency'],
        ];
        if ($price["discount"] !== 0 && $price["show_discount_on_invoice"]) {
            $priceForClient["discount"] = $price["discount"];
            $priceForClient["show_discount_on_invoice"] = $price["show_discount_on_invoice"];
            $priceForClient["original_price_net"] = $price["wholesale_net_price"];
            $priceForClient["original_price_gross"] = $price["wholesale_gross_price"];

        }

        return $priceForClient;
    }
}
