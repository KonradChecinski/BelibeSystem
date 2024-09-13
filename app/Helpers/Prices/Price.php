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

    public static function calculateTotalFromCartItems(Collection $cartModel, bool $discount, int $discountValue): object
    {
        $priceSummaryGrouped = $cartModel->map(function ($item) {
            return collect([
                "quantity" => $item->quantity,
                "original_total_net" => $item->original_price_net,
                "total_net" => $item->price_net,
//                "total_gross" => $item->price_net * (1 + $item->vat_rate / 100) * $item->quantity,
                "vat_rate" => $item->vat_rate,
            ]);
        })->groupBy("vat_rate");

        $priceSummaryGroupByVat = collect();
        foreach ($priceSummaryGrouped as $vat_rate => $items) {
            $total_net = $items->reduce(function ($carry, $item) {
                $carry += $item["total_net"] * $item["quantity"];
                return $carry;
            }, 0);
            $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

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
                $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

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
//            $discountedTotalNet = $priceSummary["total_net"];
//            $discountedTotalGross = $priceSummary["total_gross"];
        }


        return (object)[
            "priceSummary" => $priceSummary,
            "discountedPriceSummary" => $discountedPriceSummary,
        ];
    }
}
