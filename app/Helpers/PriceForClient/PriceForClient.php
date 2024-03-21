<?php

namespace App\Helpers\PriceForClient;

use App\Models\Client\Client;
use App\Models\Products\ProductModel;

class PriceForClient
{
    public static function getPrice(ProductModel $productModel, Client $client)
    {
        $discounts = $client->discounts;

//       Możliwe opcje obniżenia ceny
//       $productModel=$productModel;
        $categories = $productModel->categories;
        $group = $productModel->group;
        $brand = $productModel->brand;

        $discountsForProductModel = $discounts->where("type", 1)->where('product_model_id', $productModel->id);
        $discountsForCategories = $discounts->where("type", 2)->whereIn('product_category_id', $categories->map(fn($category) => $category->id));
        $discountsForGroup = $discounts->where("type", 3)->where('product_group_id', $group->id);
        $discountsForBrand = $discounts->where("type", 4)->where('product_brand_id', $brand->id);


//        Ceny
        $price = $productModel->prices;
        $vat = $price->vat_rate;
        $priceNet = $price->wholesale_net_price;
        $priceGross = $price->wholesale_gross_price;

        if ($discountsForProductModel->isNotEmpty()) {
            return self::calculatePrices($priceNet, $discountsForProductModel->first()->value, $vat);
        }
        if ($discountsForCategories->isNotEmpty()) {
            $discountValue = $discountsForCategories->max("value");
            return self::calculatePrices($priceNet, $discountValue, $vat);
        }
        if ($discountsForGroup->isNotEmpty()) {
            return self::calculatePrices($priceNet, $discountsForGroup->first()->value, $vat);
        }
        if ($discountsForBrand->isNotEmpty()) {
            return self::calculatePrices($priceNet, $discountsForBrand->first()->value, $vat);
        }

        return [
            "discounted_wholesale_price_net" => $priceNet,
            "discounted_wholesale_price_gross" => $priceGross
        ];
    }

    private static function calculatePrices(int $priceNet, int $discount, int $vat): array
    {
        return [
            "discounted_wholesale_price_net" => round($priceNet - ($priceNet * ($discount / 100))),
            "discounted_wholesale_price_gross" => round(($priceNet - ($priceNet * ($discount / 100))) * (1 + $vat / 100))
        ];
    }
}
