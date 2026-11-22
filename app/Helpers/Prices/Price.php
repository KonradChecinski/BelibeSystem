<?php

namespace App\Helpers\Prices;

use App\Models\Client\Client;
use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Collection;

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
            'min_price_net' => $price['min_discounted_wholesale_net_price'] ?? $price['discounted_wholesale_net_price'],
            'min_price_gross' => $price['min_discounted_wholesale_gross_price'] ?? $price['discounted_wholesale_gross_price'],
            'max_price_net' => $price['max_discounted_wholesale_net_price'] ?? $price['discounted_wholesale_net_price'],
            'max_price_gross' => $price['max_discounted_wholesale_gross_price'] ?? $price['discounted_wholesale_gross_price'],
            'vat_rate' => $price['vat_rate'],
            'currency' => $price['currency'],
            'is_promotion' => $price['is_promotion'] ?? false,
            'applied_promotion' => $price['applied_promotion'] ?? false,
            'has_partial_promotion' => $price['has_partial_promotion'] ?? false,
            'has_variable_prices' => $price['has_variable_prices'] ?? false,
            'promotion_name' => $price['promotion_name'] ?? null,
            'promotion_discount_type' => $price['promotion_discount_type'] ?? null,
            'promotion_discount_value' => $price['promotion_discount_value'] ?? null,
            'promotion_discount_percent' => $price['promotion_discount_percent'] ?? null,
            'original_price_net' => $price['wholesale_net_price'],
            'original_price_gross' => $price['wholesale_gross_price'],
            'show_discount_on_invoice' => $price['show_discount_on_invoice'] ?? false,
        ];

        if ($price['discount'] !== 0 && $price['show_discount_on_invoice']) {
            $priceForClient['discount'] = $price['discount'];
        }

        return $priceForClient;
    }

    public static function calculateTotalFromCartItems(Collection $cartModel, bool $discount, int $discountValue): object
    {
        $priceSummaryGrouped = $cartModel->map(function ($item) {
            return collect([
                "quantity" => $item->quantity,
                "original_total_net" => $item->original_price_net,
                "total_net" => $item->price_net,
                "vat_rate" => $item->vat_rate,
            ]);
        })->groupBy("vat_rate");

        $priceSummaryGroupByVat = collect();
        foreach ($priceSummaryGrouped as $vat_rate => $items) {
            $total_net = $items->reduce(function ($carry, $item) {
                $carry += $item["total_net"] * $item["quantity"];
                return $carry;
            }, 0);
            $total_gross = round($total_net * (1 + $vat_rate / 100));

            $priceSummaryGroupByVat[$vat_rate] = [
                "total_net" => $total_net,
                "total_gross" => $total_gross,
                "vat_rate" => $vat_rate,
            ];
        }
        $priceSummary = $priceSummaryGroupByVat->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);


        if ($discount) {

            $discountedPriceSummaryGroupByVat = collect();
            foreach ($priceSummaryGrouped as $vat_rate => $items) {
                $total_net = $items->reduce(function ($carry, $item) use ($discountValue) {
                    $carry += (round($item["total_net"] * (100 - $discountValue) / 100) * $item["quantity"]);
                    return $carry;
                }, 0);
                $total_gross = round($total_net * (1 + $vat_rate / 100));

                $discountedPriceSummaryGroupByVat[$vat_rate] = [
                    "total_net" => $total_net,
                    "total_gross" => $total_gross,
                    "vat_rate" => $vat_rate,
                ];
            }
            $discountedPriceSummary = $discountedPriceSummaryGroupByVat->reduce(function ($carry, $item) {
                $carry["total_net"] += $item["total_net"];
                $carry["total_gross"] += $item["total_gross"];
                return $carry;
            }, ["total_net" => 0, "total_gross" => 0]);


        } else {
            $discountedPriceSummary = $priceSummary;
        }


        return (object)[
            "priceSummary" => $priceSummary,
            "discountedPriceSummary" => $discountedPriceSummary,
        ];
    }
}
