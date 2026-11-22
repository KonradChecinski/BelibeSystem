<?php

namespace App\Helpers\Prices;

use App\Models\Client\Client;
use App\Models\ClientDiscount;
use App\Models\ProductBrand;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Promotion;
use App\Models\PromotionItem;
use Illuminate\Support\Collection;

class PriceForClient
{
    /**
     * Cache aktywnych pozycji promocji B2B w ramach bieżącego żądania HTTP.
     */
    protected static ?Collection $activeB2bPromotionItemsCache = null;

    /**
     * Pobiera i cache'uje wszystkie pozycje aktualnie aktywnych promocji B2B wraz z modelem Promotion.
     */
    public static function getActiveB2bPromotionItems(): Collection
    {
        if (self::$activeB2bPromotionItemsCache !== null) {
            return self::$activeB2bPromotionItemsCache;
        }

        try {
            self::$activeB2bPromotionItemsCache = PromotionItem::query()
                ->whereHas('promotion', function ($query) {
                    $query->activeForB2b();
                })
                ->with(['promotion'])
                ->get();
        } catch (\Throwable $e) {
            // Na wypadek wywołania przed uruchomieniem migracji
            self::$activeB2bPromotionItemsCache = collect();
        }

        return self::$activeB2bPromotionItemsCache;
    }

    /**
     * Czyści cache aktywnych promocji (np. po zapisie promocji lub w testach).
     */
    public static function clearPromotionCache(): void
    {
        self::$activeB2bPromotionItemsCache = null;
    }

    /**
     * Oblicza cenę dla konkretnego produktu (rozmiaru w kolorze modelu) dla klienta B2B.
     * Uwzględnia pełną hierarchię promocji:
     * Produkt (1) > Kolor (2) > Model (3) > Kategoria (4) > Grupa (5) > Marka (6) > Wszystko (7)
     * oraz porównuje z rabatem klienta.
     */
    public static function getPriceFromProduct(Product $product, Client $client, int $extraDiscountPercent = 0): array
    {
        $product->loadMissing(['color.model.prices', 'color.model.categories', 'color.model.group', 'color.model.brand']);
        $color = $product->color;
        $productModel = $color ? $color->model : $product->model;

        return self::evaluatePriceForTarget(
            productModel: $productModel,
            categories: $productModel?->categories,
            group: $productModel?->group,
            brand: $productModel?->brand,
            price: $productModel->prices,
            discounts: $client->discounts,
            colorId: $color?->id ?? $product->product_model_color_id,
            productId: $product->id,
            extraDiscountPercent: $extraDiscountPercent
        );
    }

    /**
     * Oblicza cenę dla konkretnego koloru modelu dla klienta B2B.
     * Uwzględnia hierarchię promocji od poziomu Koloru (2) w dół, oraz sprawdza czy poszczególne rozmiary w tym kolorze mają indywidualne promocje.
     */
    public static function getPriceFromProductModelColor(
        ProductModelColor $color,
        ProductModel $productModel,
        Client $client,
        int $extraDiscountPercent = 0
    ): array {
        $discounts = $client->discounts;
        $categories = $productModel->categories;
        $group = $productModel->group;
        $brand = $productModel->brand;
        $price = $productModel->prices;

        $colorPrice = self::evaluatePriceForTarget(
            productModel: $productModel,
            categories: $categories,
            group: $group,
            brand: $brand,
            price: $price,
            discounts: $discounts,
            colorId: $color->id,
            productId: null,
            extraDiscountPercent: $extraDiscountPercent
        );

        // Sprawdź czy w tym kolorze są produkty z indywidualną promocją (poziom 1)
        $products = $color->relationLoaded('products') ? $color->products : $color->products()->where('show_in_b2b', true)->get();
        $minNet = $colorPrice['discounted_wholesale_net_price'];
        $maxNet = $colorPrice['discounted_wholesale_net_price'];
        $hasProductPromotion = false;

        foreach ($products as $product) {
            $pPrice = self::evaluatePriceForTarget(
                productModel: $productModel,
                categories: $categories,
                group: $group,
                brand: $brand,
                price: $price,
                discounts: $discounts,
                colorId: $color->id,
                productId: $product->id,
                extraDiscountPercent: $extraDiscountPercent
            );
            if ($pPrice['is_promotion'] && $pPrice['promotion_level'] === PromotionItem::TYPE_PRODUCT) {
                $hasProductPromotion = true;
            }
            if ($pPrice['discounted_wholesale_net_price'] < $minNet) {
                $minNet = $pPrice['discounted_wholesale_net_price'];
            }
            if ($pPrice['discounted_wholesale_net_price'] > $maxNet) {
                $maxNet = $pPrice['discounted_wholesale_net_price'];
            }
        }

        $vat = $price->vat_rate;
        $colorPrice['has_product_promotion'] = $hasProductPromotion;
        $colorPrice['is_promotion'] = $colorPrice['is_promotion'] || $hasProductPromotion;
        $colorPrice['min_discounted_wholesale_net_price'] = $minNet;
        $colorPrice['min_discounted_wholesale_gross_price'] = (int) round($minNet * (1 + $vat / 100));
        $colorPrice['has_variable_prices'] = $minNet !== $maxNet;

        return $colorPrice;
    }

    public static function getPriceFromProductModel(ProductModel $productModel, Client $client, int $extraDiscountPercent = 0): array
    {
        $discounts = $client->discounts;
        $categories = $productModel->categories;
        $group = $productModel->group;
        $brand = $productModel->brand;
        $price = $productModel->prices;

        return self::getPrice($productModel, $categories, $group, $brand, $price, $discounts, $extraDiscountPercent);
    }

    /**
     * @param ProductModel|null $productModel
     * @param Collection|ProductCategory[]|null $categories
     * @param ProductGroup|null $group
     * @param ProductBrand|null $brand
     * @param ProductModelPrice $price
     * @param Collection|ClientDiscount[] $discounts
     * @param int $extraDiscountPercent
     * @return array
     */
    public static function getPrice(
        ?ProductModel $productModel,
        array|Collection|null $categories,
        ?ProductGroup $group,
        ?ProductBrand $brand,
        ProductModelPrice $price,
        array|Collection $discounts,
        int $extraDiscountPercent = 0
    ): array {
        $baseModelEval = self::evaluatePriceForTarget(
            productModel: $productModel,
            categories: $categories,
            group: $group,
            brand: $brand,
            price: $price,
            discounts: $discounts,
            colorId: null,
            productId: null,
            extraDiscountPercent: $extraDiscountPercent
        );

        if (is_null($productModel)) {
            return $baseModelEval;
        }

        // Sprawdź czy jakiekolwiek kolory (type = 2) lub produkty (type = 1) tego modelu mają promocję
        $promoItems = self::getActiveB2bPromotionItems();
        if ($promoItems->isEmpty()) {
            return $baseModelEval;
        }

        $colors = $productModel->relationLoaded('colorsToB2b')
            ? $productModel->colorsToB2b
            : $productModel->colorsToB2b()->get(['id', 'product_model_id', 'product_color_icon_id']);

        $products = $productModel->relationLoaded('productsToB2bWithoutRelation')
            ? $productModel->productsToB2bWithoutRelation
            : $productModel->productsToB2bWithoutRelation()->get(['products.id', 'products.product_model_color_id']);

        $colorIds = $colors->pluck('id')->all();
        $productIds = $products->pluck('id')->all();

        $hasSpecificColorOrProductPromo = $promoItems->contains(function (PromotionItem $item) use ($colorIds, $productIds) {
            return ($item->type === PromotionItem::TYPE_COLOR && in_array($item->product_model_color_id, $colorIds, true))
                || ($item->type === PromotionItem::TYPE_PRODUCT && in_array($item->product_id, $productIds, true));
        });

        if (!$hasSpecificColorOrProductPromo) {
            return $baseModelEval;
        }

        // Wylicz zakres cen (min/max) po wszystkich wariantach B2B modelu oraz które ikony kolorów mają dedykowaną promocję
        $minNet = $baseModelEval['discounted_wholesale_net_price'];
        $maxNet = $baseModelEval['discounted_wholesale_net_price'];
        $anyPromo = $baseModelEval['is_promotion'];
        $anyAppliedPromo = $baseModelEval['applied_promotion'];
        $specificallyPromotedColorIds = [];
        $specificallyPromotedColorIconIds = [];

        $colorMap = $colors->keyBy('id');
        $productsByColor = $products->groupBy('product_model_color_id');

        foreach ($colors as $color) {
            $colorProducts = $productsByColor->get($color->id, collect());

            if ($colorProducts->isEmpty()) {
                $cEval = self::evaluatePriceForTarget(
                    productModel: $productModel,
                    categories: $categories,
                    group: $group,
                    brand: $brand,
                    price: $price,
                    discounts: $discounts,
                    colorId: $color->id,
                    productId: null,
                    extraDiscountPercent: $extraDiscountPercent
                );
                if ($cEval['is_promotion']) {
                    $anyPromo = true;
                    if (in_array($cEval['promotion_level'], [PromotionItem::TYPE_COLOR, PromotionItem::TYPE_PRODUCT], true)) {
                        $specificallyPromotedColorIds[] = $color->id;
                        if ($color->product_color_icon_id) {
                            $specificallyPromotedColorIconIds[] = $color->product_color_icon_id;
                        }
                    }
                }
                if ($cEval['applied_promotion']) {
                    $anyAppliedPromo = true;
                }
                $minNet = min($minNet, $cEval['discounted_wholesale_net_price']);
                $maxNet = max($maxNet, $cEval['discounted_wholesale_net_price']);
                continue;
            }

            foreach ($colorProducts as $product) {
                $pEval = self::evaluatePriceForTarget(
                    productModel: $productModel,
                    categories: $categories,
                    group: $group,
                    brand: $brand,
                    price: $price,
                    discounts: $discounts,
                    colorId: $color->id,
                    productId: $product->id,
                    extraDiscountPercent: $extraDiscountPercent
                );

                if ($pEval['is_promotion']) {
                    $anyPromo = true;
                    if (in_array($pEval['promotion_level'], [PromotionItem::TYPE_COLOR, PromotionItem::TYPE_PRODUCT], true)) {
                        $specificallyPromotedColorIds[] = $color->id;
                        if ($color->product_color_icon_id) {
                            $specificallyPromotedColorIconIds[] = $color->product_color_icon_id;
                        }
                    }
                }
                if ($pEval['applied_promotion']) {
                    $anyAppliedPromo = true;
                }
                $minNet = min($minNet, $pEval['discounted_wholesale_net_price']);
                $maxNet = max($maxNet, $pEval['discounted_wholesale_net_price']);
            }
        }

        $vat = $price->vat_rate;
        $baseModelEval['is_promotion'] = $anyPromo;
        $baseModelEval['applied_promotion'] = $anyAppliedPromo;
        $baseModelEval['has_partial_promotion'] = true;
        $baseModelEval['has_variable_prices'] = $minNet !== $maxNet;
        $baseModelEval['min_discounted_wholesale_net_price'] = $minNet;
        $baseModelEval['min_discounted_wholesale_gross_price'] = (int) round($minNet * (1 + $vat / 100));
        $baseModelEval['max_discounted_wholesale_net_price'] = $maxNet;
        $baseModelEval['max_discounted_wholesale_gross_price'] = (int) round($maxNet * (1 + $vat / 100));
        $baseModelEval['promoted_color_ids'] = array_values(array_unique($specificallyPromotedColorIds));
        $baseModelEval['promoted_color_icon_ids'] = array_values(array_unique($specificallyPromotedColorIconIds));

        return $baseModelEval;
    }

    /**
     * Główny silnik wyliczania ceny dla danego kontekstu (Produkt / Kolor / Model).
     */
    public static function evaluatePriceForTarget(
        ?ProductModel $productModel,
        array|Collection|null $categories,
        ?ProductGroup $group,
        ?ProductBrand $brand,
        ProductModelPrice $price,
        array|Collection $discounts,
        ?int $colorId = null,
        ?int $productId = null,
        int $extraDiscountPercent = 0
    ): array {
        $discountsCollection = $discounts instanceof Collection ? $discounts : collect($discounts);
        $categoriesCollection = $categories instanceof Collection ? $categories : (!is_null($categories) ? collect($categories) : null);

        $vat = (int) $price->vat_rate;
        $priceNet = (int) $price->wholesale_net_price;
        $priceGross = (int) round($priceNet * (1 + $vat / 100));

        // 1. Wylicz rabat klienta (według hierarchii rabatów klienta: Model (1) > Kategoria (2) > Grupa (3) > Marka (4) > Wszystko (5))
        $clientDiscountResult = self::resolveClientDiscount(
            productModel: $productModel,
            categories: $categoriesCollection,
            group: $group,
            brand: $brand,
            priceNet: $priceNet,
            vat: $vat,
            discounts: $discountsCollection,
            extraDiscountPercent: $extraDiscountPercent
        );

        // 2. Wylicz promocję B2B według hierarchii szczegółowości:
        // Produkt (1) > Kolor (2) > Model (3) > Kategoria (4) > Grupa (5) > Marka (6) > Wszystko (7)
        $promotionResult = self::resolvePromotion(
            productId: $productId,
            colorId: $colorId,
            productModelId: $productModel?->id,
            categoryIds: $categoriesCollection ? $categoriesCollection->pluck('id')->all() : [],
            groupId: $group?->id ?? $productModel?->product_group_id,
            brandId: $brand?->id ?? $productModel?->product_brand_id,
            priceNet: $priceNet,
            vat: $vat
        );

        $hasPromotion = $promotionResult !== null;
        $appliedPromotion = false;

        if ($hasPromotion && $promotionResult['discounted_wholesale_net_price'] < $clientDiscountResult['discounted_wholesale_net_price']) {
            // Promocja jest korzystniejsza niż rabat klienta -> stosujemy cenę i ustawienie show_discount_on_invoice z promocji
            $finalNet = $promotionResult['discounted_wholesale_net_price'];
            $finalGross = $promotionResult['discounted_wholesale_gross_price'];
            $finalDiscount = $promotionResult['discount'];
            $finalShowOnInvoice = $promotionResult['show_discount_on_invoice'];
            $appliedPromotion = true;
        } else {
            // Rabat klienta jest korzystniejszy (lub równy), albo brak promocji -> stosujemy cenę i ustawienie z rabatu klienta
            $finalNet = $clientDiscountResult['discounted_wholesale_net_price'];
            $finalGross = $clientDiscountResult['discounted_wholesale_gross_price'];
            $finalDiscount = $clientDiscountResult['discount'];
            $finalShowOnInvoice = $clientDiscountResult['show_discount_on_invoice'];
        }

        return [
            'discounted_wholesale_net_price' => $finalNet,
            'discounted_wholesale_gross_price' => $finalGross,
            'min_discounted_wholesale_net_price' => $finalNet,
            'min_discounted_wholesale_gross_price' => $finalGross,
            'max_discounted_wholesale_net_price' => $finalNet,
            'max_discounted_wholesale_gross_price' => $finalGross,
            'original_wholesale_net_price' => $priceNet,
            'original_wholesale_gross_price' => $priceGross,
            'discount' => $finalDiscount,
            'vat_rate' => $vat,
            'show_discount_on_invoice' => $finalShowOnInvoice,
            'is_promotion' => $hasPromotion,
            'applied_promotion' => $appliedPromotion,
            'has_partial_promotion' => false,
            'has_variable_prices' => false,
            'promotion_id' => $promotionResult['promotion_id'] ?? null,
            'promotion_name' => $promotionResult['promotion_name'] ?? null,
            'promotion_discount_type' => $promotionResult['promotion_discount_type'] ?? null,
            'promotion_discount_value' => $promotionResult['promotion_discount_value'] ?? null,
            'promotion_discount_percent' => $promotionResult['discount'] ?? null,
            'promotion_price_net' => $promotionResult['discounted_wholesale_net_price'] ?? null,
            'promotion_price_gross' => $promotionResult['discounted_wholesale_gross_price'] ?? null,
            'promotion_level' => $promotionResult['promotion_level'] ?? null,
            'promoted_color_ids' => [],
            'promoted_color_icon_ids' => [],
        ];
    }

    /**
     * Wylicza rabat klienta z jego przypisanych rabatów.
     */
    private static function resolveClientDiscount(
        ?ProductModel $productModel,
        ?Collection $categories,
        ?ProductGroup $group,
        ?ProductBrand $brand,
        int $priceNet,
        int $vat,
        Collection $discounts,
        int $extraDiscountPercent = 0
    ): array {
        if (!is_null($productModel)) {
            $discountsForProductModel = $discounts->where('type', 1)->where('product_model_id', $productModel->id);
            if ($discountsForProductModel->isNotEmpty()) {
                $discountModel = $discountsForProductModel->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, (bool) $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($categories) && $categories->isNotEmpty()) {
            $discountsForCategories = $discounts->where('type', 2)->whereIn('product_category_id', $categories->map(fn($category) => $category->id));
            if ($discountsForCategories->isNotEmpty()) {
                $discountModel = $discountsForCategories->sortByDesc('value')->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, (bool) $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($group)) {
            $discountsForGroup = $discounts->where('type', 3)->where('product_group_id', $group->id);
            if ($discountsForGroup->isNotEmpty()) {
                $discountModel = $discountsForGroup->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, (bool) $discountModel->show_discount_on_invoice);
            }
        }

        if (!is_null($brand)) {
            $discountsForBrand = $discounts->where('type', 4)->where('product_brand_id', $brand->id);
            if ($discountsForBrand->isNotEmpty()) {
                $discountModel = $discountsForBrand->first();
                return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, (bool) $discountModel->show_discount_on_invoice);
            }
        }

        $discountsForEverything = $discounts->where('type', 5);
        if ($discountsForEverything->isNotEmpty()) {
            $discountModel = $discountsForEverything->first();
            return self::calculatePrices($priceNet, $discountModel->value + $extraDiscountPercent, $vat, (bool) $discountModel->show_discount_on_invoice);
        }

        if ($extraDiscountPercent > 0) {
            return self::calculatePrices($priceNet, $extraDiscountPercent, $vat, false);
        }

        return [
            'discounted_wholesale_net_price' => $priceNet,
            'discounted_wholesale_gross_price' => (int) round($priceNet * (1 + $vat / 100)),
            'discount' => 0,
            'vat_rate' => $vat,
            'show_discount_on_invoice' => false,
        ];
    }

    /**
     * Znajduje najlepszą aktywną promocję B2B zgodnie z hierarchią szczegółowości:
     * 1: Produkt -> 2: Kolor -> 3: Model -> 4: Kategoria -> 5: Grupa -> 6: Marka -> 7: Wszystko.
     * W ramach tego samego poziomu wygrywa promocja dająca najniższą cenę dla klienta.
     */
    private static function resolvePromotion(
        ?int $productId,
        ?int $colorId,
        ?int $productModelId,
        array $categoryIds,
        ?int $groupId,
        ?int $brandId,
        int $priceNet,
        int $vat
    ): ?array {
        $items = self::getActiveB2bPromotionItems();
        if ($items->isEmpty()) {
            return null;
        }

        $levels = [];

        if (!is_null($productId)) {
            $levels[PromotionItem::TYPE_PRODUCT] = $items
                ->where('type', PromotionItem::TYPE_PRODUCT)
                ->where('product_id', $productId);
        }

        if (!is_null($colorId)) {
            $levels[PromotionItem::TYPE_COLOR] = $items
                ->where('type', PromotionItem::TYPE_COLOR)
                ->where('product_model_color_id', $colorId);
        }

        if (!is_null($productModelId)) {
            $levels[PromotionItem::TYPE_MODEL] = $items
                ->where('type', PromotionItem::TYPE_MODEL)
                ->where('product_model_id', $productModelId);
        }

        if (!empty($categoryIds)) {
            $levels[PromotionItem::TYPE_CATEGORY] = $items
                ->where('type', PromotionItem::TYPE_CATEGORY)
                ->whereIn('product_category_id', $categoryIds);
        }

        if (!is_null($groupId)) {
            $levels[PromotionItem::TYPE_GROUP] = $items
                ->where('type', PromotionItem::TYPE_GROUP)
                ->where('product_group_id', $groupId);
        }

        if (!is_null($brandId)) {
            $levels[PromotionItem::TYPE_BRAND] = $items
                ->where('type', PromotionItem::TYPE_BRAND)
                ->where('product_brand_id', $brandId);
        }

        $levels[PromotionItem::TYPE_EVERYTHING] = $items
            ->where('type', PromotionItem::TYPE_EVERYTHING);

        foreach ($levels as $levelType => $matchingItems) {
            if ($matchingItems->isEmpty()) {
                continue;
            }

            $bestItem = null;
            $bestPromoPriceNet = null;

            foreach ($matchingItems as $item) {
                $promotion = $item->promotion;
                if (!$promotion) {
                    continue;
                }

                $candidateNet = $promotion->calculatePromotionalPrice($priceNet);
                if ($bestPromoPriceNet === null || $candidateNet < $bestPromoPriceNet) {
                    $bestPromoPriceNet = $candidateNet;
                    $bestItem = $item;
                }
            }

            if ($bestItem && $bestItem->promotion) {
                $winningPromotion = $bestItem->promotion;
                $effectiveDiscountPercent = $winningPromotion->calculateEffectiveDiscountPercent($priceNet);

                return [
                    'discounted_wholesale_net_price' => $bestPromoPriceNet,
                    'discounted_wholesale_gross_price' => (int) round($bestPromoPriceNet * (1 + $vat / 100)),
                    'discount' => $effectiveDiscountPercent,
                    'vat_rate' => $vat,
                    'show_discount_on_invoice' => (bool) $winningPromotion->show_discount_on_invoice,
                    'promotion_id' => $winningPromotion->id,
                    'promotion_name' => $winningPromotion->name,
                    'promotion_discount_type' => $winningPromotion->discount_type,
                    'promotion_discount_value' => $winningPromotion->discount_value,
                    'promotion_level' => $levelType,
                ];
            }
        }

        return null;
    }

    /**
     * Zwraca kolekcję ID modeli (ProductModel), które są objęte jakąkolwiek aktualnie aktywną promocją B2B
     * (bezpośrednio lub przez produkt, kolor, kategorię, grupę, markę, albo "Wszystko").
     * Przydatne m.in. dla strony Promocje w B2B.
     */
    public static function getPromotedProductModelIdsQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $items = self::getActiveB2bPromotionItems();

        $query = ProductModel::query()->whereHas('productsToB2bWithoutRelation', function ($q) {
            $q->where('show_in_b2b', true);
        });

        if ($items->isEmpty()) {
            return $query->whereRaw('1 = 0');
        }

        // Jeśli istnieje aktywna promocja na "Wszystko" (type = 7), każdy model B2B jest w promocji
        if ($items->where('type', PromotionItem::TYPE_EVERYTHING)->isNotEmpty()) {
            return $query;
        }

        $productIds = $items->where('type', PromotionItem::TYPE_PRODUCT)->pluck('product_id')->filter()->unique()->values()->all();
        $colorIds = $items->where('type', PromotionItem::TYPE_COLOR)->pluck('product_model_color_id')->filter()->unique()->values()->all();
        $modelIds = $items->where('type', PromotionItem::TYPE_MODEL)->pluck('product_model_id')->filter()->unique()->values()->all();
        $categoryIds = $items->where('type', PromotionItem::TYPE_CATEGORY)->pluck('product_category_id')->filter()->unique()->values()->all();
        $groupIds = $items->where('type', PromotionItem::TYPE_GROUP)->pluck('product_group_id')->filter()->unique()->values()->all();
        $brandIds = $items->where('type', PromotionItem::TYPE_BRAND)->pluck('product_brand_id')->filter()->unique()->values()->all();

        return $query->where(function ($q) use ($productIds, $colorIds, $modelIds, $categoryIds, $groupIds, $brandIds) {
            $hasCondition = false;

            if (!empty($modelIds)) {
                $q->orWhereIn('product_models.id', $modelIds);
                $hasCondition = true;
            }
            if (!empty($groupIds)) {
                $q->orWhereIn('product_models.product_group_id', $groupIds);
                $hasCondition = true;
            }
            if (!empty($brandIds)) {
                $q->orWhereIn('product_models.product_brand_id', $brandIds);
                $hasCondition = true;
            }
            if (!empty($categoryIds)) {
                $q->orWhereHas('categories', function ($cq) use ($categoryIds) {
                    $cq->whereIn('product_categories.id', $categoryIds);
                });
                $hasCondition = true;
            }
            if (!empty($colorIds)) {
                $q->orWhereHas('colorsToB2b', function ($colQ) use ($colorIds) {
                    $colQ->whereIn('product_model_colors.id', $colorIds);
                });
                $hasCondition = true;
            }
            if (!empty($productIds)) {
                $q->orWhereHas('productsToB2bWithoutRelation', function ($prodQ) use ($productIds) {
                    $prodQ->whereIn('products.id', $productIds);
                });
                $hasCondition = true;
            }

            if (!$hasCondition) {
                $q->whereRaw('1 = 0');
            }
        });
    }

    private static function calculatePrices(int $priceNet, int $discount, int $vat, bool $showOnInvoice): array
    {
        $discountedNet = (int) round($priceNet - ($priceNet * ($discount / 10000)));
        return [
            'discounted_wholesale_net_price' => $discountedNet,
            'discounted_wholesale_gross_price' => (int) round($discountedNet * (1 + $vat / 100)),
            'discount' => $discount,
            'vat_rate' => $vat,
            'show_discount_on_invoice' => $showOnInvoice,
        ];
    }
}
