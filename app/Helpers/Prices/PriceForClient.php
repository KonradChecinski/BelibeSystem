<?php

namespace App\Helpers\Prices;

use App\Models\Client\Client;
use App\Models\ClientDiscount;
use App\Models\ProductBrand;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use Illuminate\Support\Collection;

class PriceForClient
{
    public static function getPriceFromProductModel(ProductModel $productModel, Client $client, int $extraDiscountPercent = 0)
    {
        $discounts = $client->discounts;

//       Możliwe opcje obniżenia ceny
//       $productModel=$productModel;
        $categories = $productModel->categories;
        $group = $productModel->group;
        $brand = $productModel->brand;

//        Ceny
        $price = $productModel->prices;
        $vat = $price->vat_rate;
        $priceNet = $price->wholesale_net_price;


        if (!is_null($productModel)) {
            $discountsForProductModel = $discounts->where("type", 1)->where('product_model_id', $productModel->id);
            if ($discountsForProductModel->isNotEmpty()) {
                $discountModel = $discountsForProductModel->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($categories)) {
            $discountsForCategories = $discounts->where("type", 2)->whereIn('product_category_id', $categories->map(fn($category) => $category->id));

            if ($discountsForCategories->isNotEmpty()) {
                $discountModel = $discountsForCategories->orderBy("value", "desc")->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($group)) {
            $discountsForGroup = $discounts->where("type", 3)->where('product_group_id', $group->id);

            if ($discountsForGroup->isNotEmpty()) {
                $discountModel = $discountsForGroup->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($brand)) {
            $discountsForBrand = $discounts->where("type", 4)->where('product_brand_id', $brand->id);

            if ($discountsForBrand->isNotEmpty()) {
                $discountModel = $discountsForBrand->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (true) {
            $discountsForEverything = $discounts->where("type", 5);

            if ($discountsForEverything->isNotEmpty()) {
                $discountModel = $discountsForEverything->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        return [
            "discounted_wholesale_net_price" => $priceNet,
            "discounted_wholesale_gross_price" => round($priceNet * (1 + $vat / 100)),
            "discount" => 0,
            "vat_rate" => $vat,
            "show_discount_on_invoice" => false
        ];
    }

    /**
     * @param ProductModel|null $productModel
     * @param Collection|ProductCategory[]|null $categories
     * @param ProductGroup|null $group
     * @param ProductBrand|null $brand
     * @param ProductModelPrice $price
     * @param Collection|ClientDiscount[] $discounts
     * @return array
     */
    public static function getPrice(?ProductModel $productModel, array|Collection|null $categories, ?ProductGroup $group, ?ProductBrand $brand, ProductModelPrice $price, array|Collection $discounts, int $extraDiscountPercent = 0): array
    {
//        $discounts = $client->discounts;

//       Możliwe opcje obniżenia ceny
//       $productModel=$productModel;
//        $categories = $productModel->categories;
//        $group = $productModel->group;
//        $brand = $productModel->brand;

//        Ceny
//        $price = $productModel->prices;
        $vat = $price->vat_rate;
        $priceNet = $price->wholesale_net_price;


        if (!is_null($productModel)) {
            $discountsForProductModel = $discounts->where("type", 1)->where('product_model_id', $productModel->id);
            if ($discountsForProductModel->isNotEmpty()) {
                $discountModel = $discountsForProductModel->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($categories)) {
            $discountsForCategories = $discounts->where("type", 2)->whereIn('product_category_id', $categories->map(fn($category) => $category->id));

            if ($discountsForCategories->isNotEmpty()) {
                $discountModel = $discountsForCategories->orderBy("value", "desc")->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($group)) {
            $discountsForGroup = $discounts->where("type", 3)->where('product_group_id', $group->id);

            if ($discountsForGroup->isNotEmpty()) {
                $discountModel = $discountsForGroup->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($brand)) {
            $discountsForBrand = $discounts->where("type", 4)->where('product_brand_id', $brand->id);

            if ($discountsForBrand->isNotEmpty()) {
                $discountModel = $discountsForBrand->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        if (true) {
            $discountsForEverything = $discounts->where("type", 5);

            if ($discountsForEverything->isNotEmpty()) {
                $discountModel = $discountsForEverything->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, $discountModel->show_discount_on_invoice);
            }
        }

        return [
            "discounted_wholesale_net_price" => $priceNet,
            "discounted_wholesale_gross_price" => round($priceNet * (1 + $vat / 100)),
            "discount" => 0,
            "vat_rate" => $vat,
            "show_discount_on_invoice" => false
        ];
    }

    private static function calculatePrices(int $priceNet, int $discount, int $vat, bool $showOnInvoice): array
    {
        return [
            "discounted_wholesale_net_price" => round($priceNet - ($priceNet * ($discount / 10000))),
            "discounted_wholesale_gross_price" => round(round($priceNet - ($priceNet * ($discount / 10000))) * (1 + $vat / 100)),
            "discount" => $discount,
            "vat_rate" => $vat,
            "show_discount_on_invoice" => $showOnInvoice
        ];
    }
}
