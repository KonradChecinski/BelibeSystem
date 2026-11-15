<?php

namespace App\Helpers\TikTok;

use App\Models\Products\Product;
use App\Models\Products\ProductModelColor;
use App\Models\ProductSizeChart;
use App\Models\TikTok\TiktokProduct;
use Illuminate\Support\Collection;
use InvalidArgumentException;
use Laraditz\TikTok\Exceptions\TikTokAPIError;
use Laraditz\TikTok\Models\TiktokShop;
use Laraditz\TikTok\TikTok as LaraditzTikTok;

class TikTokProductMapper
{
    public function __construct(
        protected TikTokImageUploader $imageUploader
    ) {
    }

    /**
     * Build payload for creating or updating a ProductModelColor in TikTok Shop (API v202309).
     *
     * 1 ProductModelColor = 1 TikTok Product
     * Each active Product (show_in_tiktok = 1) = 1 size variant (SKU) in TikTok Shop.
     */
    public function buildProductPayload(
        ProductModelColor $color,
        ?TiktokProduct $existingTiktokProduct = null,
        ?string $shopId = null
    ): array {
        $color->loadMissing([
            'model.brand',
            'model.tiktokCategory',
            'model.sizeChart',
            'model.prices',
            'images',
            'products.size',
            'products.barcodes',
            'products.mainBarcode',
            'products.tiktokSkus',
        ]);

        $model = $color->model;
        if (!$model) {
            throw new InvalidArgumentException("Kolor produktu ID {$color->id} nie posiada przypisanego modelu ProductModel.");
        }

        $activeProducts = $color->products
            ->filter(fn (Product $product) => (bool) $product->show_in_tiktok)
            ->values();

        if ($activeProducts->isEmpty()) {
            throw new InvalidArgumentException("Kolor produktu ID {$color->id} nie posiada żadnych aktywnych wariantów przeznaczonych do TikTok Shop (show_in_tiktok = 1).");
        }

        $title = trim((string) ($color->b2c_product_name ?: ($model->name . ' - ' . $color->name)));
        if ($title === '') {
            throw new InvalidArgumentException("Brak nazwy produktu B2C (title) dla koloru ID {$color->id}.");
        }

        $description = trim((string) $model->description_b2c);
        if ($description === '') {
            throw new InvalidArgumentException("Brak opisu B2C (description_b2c) dla modelu ID {$model->id}.");
        }

        $categoryId = trim((string) ($model->tiktokCategory?->value ?: $model->tiktokCategory?->name));
        if ($categoryId === '') {
            throw new InvalidArgumentException("Brak przypisanej kategorii TikTok dla modelu ID {$model->id}.");
        }

        $grossPriceCents = (int) ($model->prices?->b2c_gross_price ?? 0);
        if ($grossPriceCents <= 0) {
            throw new InvalidArgumentException("Brak poprawnej ceny brutto B2C (b2c_gross_price) dla modelu ID {$model->id}.");
        }

        $warehouseId = $this->resolveWarehouseId($shopId);
        if ($warehouseId === '') {
            throw new InvalidArgumentException('Brak skonfigurowanego identyfikatora magazynu TikTok (TIKTOK_WAREHOUSE_ID).');
        }

        // Images (type = 1, ordered by order, max 9 as required by TikTok Shop API)
        $images = $color->images
            ->where('type', 1)
            ->sortBy('order')
            ->take(9)
            ->values();

        if ($images->isEmpty()) {
            throw new InvalidArgumentException("Brak zdjęć produktowych (type = 1) dla koloru ID {$color->id}.");
        }

        $mainImages = $images->map(function ($image) use ($shopId) {
            $uri = $this->imageUploader->getOrUploadMainImageUri($image, $shopId);
            return ['uri' => $uri];
        })->values()->all();

        // Package weight from product variants (default 200g)
        $weightGrams = (int) ($activeProducts->max('weight') ?: config('tiktok.default_weight_grams', 200));
        if ($weightGrams <= 0) {
            $weightGrams = (int) config('tiktok.default_weight_grams', 200);
        }

        $weightUnit = strtoupper((string) config('tiktok.package_weight_unit', 'KILOGRAM'));
        $weightValue = $weightUnit === 'GRAM'
            ? (string) $weightGrams
            : rtrim(rtrim(number_format($weightGrams / 1000, 3, '.', ''), '0'), '.');

        $dimensions = config('tiktok.package_dimensions', [
            'length' => '15',
            'width' => '15',
            'height' => '15',
            'unit' => 'CENTIMETER',
        ]);

        $existingSkusByProductId = $existingTiktokProduct
            ? $existingTiktokProduct->skus()->get()->keyBy('local_product_id')
            : collect();

        $existingSkusBySellerSku = $existingTiktokProduct
            ? $existingTiktokProduct->skus()->get()->keyBy('seller_sku')
            : collect();

        $skus = $this->mapSkus(
            products: $activeProducts,
            grossPriceCents: $grossPriceCents,
            warehouseId: $warehouseId,
            existingSkusByProductId: $existingSkusByProductId,
            existingSkusBySellerSku: $existingSkusBySellerSku
        );

        $payload = [
            'save_mode' => 'LISTING',
            'title' => $title,
            'description' => $description,
            'category_id' => $categoryId,
            'main_images' => $mainImages,
            'package_weight' => [
                'value' => $weightValue,
                'unit' => $weightUnit,
            ],
            'package_dimensions' => [
                'length' => (string) ($dimensions['length'] ?? '15'),
                'width' => (string) ($dimensions['width'] ?? '15'),
                'height' => (string) ($dimensions['height'] ?? '15'),
                'unit' => (string) ($dimensions['unit'] ?? 'CENTIMETER'),
            ],
            'skus' => $skus,
        ];

        $brandId = $this->resolveBrandId($model->brand, $categoryId, $shopId);
        if ($brandId !== '') {
            $payload['brand_id'] = $brandId;
        }

        $manufacturerIds = array_values(array_filter([$this->resolveManufacturerId($shopId)]));
        if (!empty($manufacturerIds)) {
            $payload['manufacturer_ids'] = $manufacturerIds;
        }

        $responsiblePersonIds = array_values(array_filter([$this->resolveResponsiblePersonId($shopId)]));
        if (!empty($responsiblePersonIds)) {
            $payload['responsible_person_ids'] = $responsiblePersonIds;
        }

        $productAttributes = $this->buildProductAttributes($model, $categoryId, $shopId);
        if (!empty($productAttributes)) {
            $payload['product_attributes'] = $productAttributes;
        }

        if ($model->sizeChart) {
            $templateId = $this->resolveOrSyncSizeChartTemplateId($model->sizeChart, $categoryId, $shopId);
            if ($templateId !== '') {
                $payload['size_chart'] = [
                    'template' => [
                        'id' => $templateId,
                    ],
                ];
            }
        }

        return $payload;
    }

    /**
     * Build TikTok `product_attributes` array by matching model's `tiktok_attributes`
     * against the category's attributes returned by `/product/202309/categories/{category_id}/attributes`.
     */
    public function buildProductAttributes(
        \App\Models\Products\ProductModel $model,
        string $categoryId,
        ?string $shopId = null
    ): array {
        $rawAttrs = is_array($model->tiktok_attributes) ? $model->tiktok_attributes : [];

        $complianceConfirmed = array_key_exists('compliance_labels_confirmed', $rawAttrs)
            ? (bool) $rawAttrs['compliance_labels_confirmed']
            : true;

        $countryOfOrigin = trim((string) ($rawAttrs['country_of_origin'] ?? 'Polska'));
        if ($countryOfOrigin === '') {
            $countryOfOrigin = 'Polska';
        }

        $quantityPerPack = trim((string) ($rawAttrs['quantity_per_pack'] ?? '1'));

        $normalizeList = function ($val): array {
            if (is_string($val)) {
                $val = [$val];
            }
            if (!is_array($val)) {
                return [];
            }

            return array_values(array_filter(array_map(fn ($item) => trim((string) $item), $val), fn ($item) => $item !== ''));
        };

        $careInstructions = $normalizeList($rawAttrs['care_instructions'] ?? []);
        $sportsFeatures = $normalizeList($rawAttrs['sports_feature'] ?? []);
        $materials = $normalizeList($rawAttrs['material'] ?? []);
        $compositions = $normalizeList($rawAttrs['composition'] ?? []);

        $apiAttributes = [];
        try {
            /** @var LaraditzTikTok $tiktok */
            $tiktok = app('tiktok');
            if ($shopId) {
                $tiktok->setShopId($shopId);
            } else {
                $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
                if ($defaultShopId) {
                    $tiktok->setShopId((string) $defaultShopId);
                }
            }

            $response = $tiktok->product()->categoryAttributes(
                params: ['category_id' => $categoryId],
                query: ['locale' => 'pl-PL']
            );
            $apiAttributes = data_get($response, 'data.attributes', []);
            if (!is_array($apiAttributes)) {
                $apiAttributes = [];
            }
        } catch (\Throwable) {
            $apiAttributes = [];
        }

        $synonyms = [
            'tak' => ['tak', 'yes', 'true', 'potwierdzam'],
            'nie' => ['nie', 'no', 'false'],
            'polska' => ['polska', 'poland', 'pl', 'rzeczpospolita polska'],
            'tylko pranie ręczne' => ['tylko pranie ręczne', 'pranie ręczne', 'hand wash only', 'hand wash'],
            'można prać w pralce' => ['można prać w pralce', 'pranie w pralce', 'machine washable', 'machine wash'],
            'pranie w zimnej wodzie' => ['pranie w zimnej wodzie', 'prać w zimnej wodzie', 'cold wash'],
            'poliamid' => ['poliamid', 'nylon', 'polyamide'],
            'nylon' => ['nylon', 'poliamid', 'polyamide'],
            'elastan' => ['elastan', 'spandex', 'lycra', 'elasthan'],
            'spandex' => ['spandex', 'elastan', 'lycra'],
            'lycra' => ['lycra', 'elastan', 'spandex'],
            'poliester' => ['poliester', 'polyester'],
            'bawełna' => ['bawełna', 'cotton'],
            'mikrofibra' => ['mikrofibra', 'mikrowłókno', 'microfiber', 'microfibre'],
            'pbt' => ['pbt', 'poliester pbt'],
            'frotte' => ['frotte', 'terry', 'bawełna frotte'],
            'włókno bambusowe' => ['włókno bambusowe', 'bambus', 'bamboo'],
        ];

        $matchValuesForAttribute = function (array $attr, array $desiredInputs, bool $allowFallbackFirst = false) use ($synonyms): array {
            $predefinedValues = is_array($attr['values'] ?? null) ? $attr['values'] : [];
            $isCustomizable = (bool) ($attr['is_customizable'] ?? empty($predefinedValues));
            $isMultiple = (bool) ($attr['is_multiple_selection'] ?? false);

            $matched = [];
            $usedIds = [];

            foreach ($desiredInputs as $input) {
                $inputTrimmed = trim((string) $input);
                if ($inputTrimmed === '') {
                    continue;
                }
                $inputLower = mb_strtolower($inputTrimmed);

                // 1. Najpierw szukamy dokładnego (1:1) dopasowania nazwy w wartościach słownikowych TikToka
                $foundPredefined = null;
                foreach ($predefinedValues as $pv) {
                    $pvName = trim((string) ($pv['name'] ?? ''));
                    $pvLower = mb_strtolower($pvName);
                    if ($pvLower === $inputLower) {
                        $foundPredefined = $pv;
                        break;
                    }
                }

                // 2. Jeśli atrybut NIE pozwala na wartości niestandardowe (is_customizable = false),
                // sprawdźmy dokładne synonimy (np. Tak/Yes, Polska/Poland, instrukcje prania)
                if (!$foundPredefined && !$isCustomizable) {
                    $candidates = $synonyms[$inputLower] ?? [];
                    if (!empty($candidates)) {
                        foreach ($predefinedValues as $pv) {
                            $pvName = trim((string) ($pv['name'] ?? ''));
                            $pvLower = mb_strtolower($pvName);
                            if (in_array($pvLower, $candidates, true)) {
                                $foundPredefined = $pv;
                                break;
                            }
                        }
                    }
                }

                if ($foundPredefined && !empty($foundPredefined['id'])) {
                    $pvId = (string) $foundPredefined['id'];
                    if (!isset($usedIds[$pvId])) {
                        $usedIds[$pvId] = true;
                        $matched[] = [
                            'id' => $pvId,
                            'name' => (string) ($foundPredefined['name'] ?? $inputTrimmed),
                        ];
                    }
                } elseif ($isCustomizable) {
                    $matched[] = [
                        'name' => $inputTrimmed,
                    ];
                }
            }

            if (empty($matched) && $allowFallbackFirst && !empty($predefinedValues[0]['id'])) {
                $matched[] = [
                    'id' => (string) $predefinedValues[0]['id'],
                    'name' => (string) ($predefinedValues[0]['name'] ?? ($desiredInputs[0] ?? 'Tak')),
                ];
            }

            if (!$isMultiple && count($matched) > 1) {
                // Jeśli wszystkie wartości są niestandardowe (bez 'id'), połączmy je przecinkiem
                $allCustom = collect($matched)->every(fn ($m) => empty($m['id']));
                if ($allCustom && $isCustomizable) {
                    return [
                        ['name' => implode(', ', array_column($matched, 'name'))],
                    ];
                }

                return [$matched[0]];
            }

            return $matched;
        };

        $result = [];
        $handledCompliance = false;

        foreach ($apiAttributes as $attr) {
            if (($attr['type'] ?? 'PRODUCT_PROPERTY') === 'SALES_PROPERTY') {
                continue;
            }

            $attrId = trim((string) ($attr['id'] ?? ''));
            if ($attrId === '') {
                continue;
            }

            $attrName = mb_strtolower(trim((string) ($attr['name'] ?? '')));
            $valuesToSend = [];

            if (
                $attrId === '102277'
                || str_contains($attrName, 'oznacz')
                || str_contains($attrName, 'etykiet')
                || str_contains($attrName, 'przepisa')
                || str_contains($attrName, 'compliance')
            ) {
                $handledCompliance = true;
                $valuesToSend = $matchValuesForAttribute(
                    $attr,
                    [$complianceConfirmed ? 'Tak' : 'Nie'],
                    $complianceConfirmed
                );
            } elseif (
                str_contains($attrName, 'kraj pochodzenia')
                || str_contains($attrName, 'country of origin')
                || str_contains($attrName, 'kraj produkcji')
            ) {
                if ($countryOfOrigin !== '') {
                    $valuesToSend = $matchValuesForAttribute($attr, [$countryOfOrigin]);
                }
            } elseif (
                str_contains($attrName, 'liczba w opakowaniu')
                || str_contains($attrName, 'ilość w opakowaniu')
                || str_contains($attrName, 'liczba sztuk')
                || str_contains($attrName, 'quantity per pack')
            ) {
                if ($quantityPerPack !== '') {
                    $valuesToSend = $matchValuesForAttribute($attr, [$quantityPerPack]);
                }
            } elseif (
                str_contains($attrName, 'instrukcj')
                || str_contains($attrName, 'prania')
                || str_contains($attrName, 'pielęgnac')
                || str_contains($attrName, 'care instruction')
            ) {
                if (!empty($careInstructions)) {
                    $valuesToSend = $matchValuesForAttribute($attr, $careInstructions);
                }
            } elseif (
                str_contains($attrName, 'funkcja sportowa')
                || str_contains($attrName, 'funkcje sportowe')
                || str_contains($attrName, 'cecha sportowa')
                || str_contains($attrName, 'właściwości sportowe')
                || str_contains($attrName, 'sports feature')
            ) {
                if (!empty($sportsFeatures)) {
                    $valuesToSend = $matchValuesForAttribute($attr, $sportsFeatures);
                }
            } elseif (
                str_contains($attrName, 'skład')
                || str_contains($attrName, 'composition')
            ) {
                if (!empty($compositions)) {
                    $valuesToSend = $matchValuesForAttribute($attr, $compositions);
                }
            } elseif (
                $attrName === 'materiał'
                || $attrName === 'material'
                || str_contains($attrName, 'główny materiał')
                || str_contains($attrName, 'materiał wykonania')
            ) {
                if (!empty($materials)) {
                    $valuesToSend = $matchValuesForAttribute($attr, $materials);
                }
            }

            if (!empty($valuesToSend)) {
                $result[] = [
                    'id' => $attrId,
                    'values' => $valuesToSend,
                ];
            }
        }

        if (!$handledCompliance && $complianceConfirmed) {
            $result[] = [
                'id' => '102277',
                'values' => [
                    ['name' => 'Tak'],
                ],
            ];
        }

        return $result;
    }

    /**
     * Resolve TikTok Brand ID for a local ProductBrand (`Spin` -> `Spinsport`, `Belibe` -> `belibe` / `BelibeSport`).
     * Automatically queries `/product/202309/brands` (and falls back to `POST /product/202309/brands` if needed)
     * and caches the resolved `tiktok_brand_id` on the `ProductBrand` record.
     */
    public function resolveBrandId(
        ?\App\Models\ProductBrand $brand,
        ?string $categoryId = null,
        ?string $shopId = null
    ): string {
        if (!$brand) {
            return '';
        }

        $existingId = trim((string) ($brand->tiktok_brand_id ?? ''));
        if ($existingId !== '') {
            return $existingId;
        }

        $rawName = trim((string) ($brand->name ?? ''));
        if ($rawName === '') {
            return '';
        }

        $normalize = static fn (string $str): string => (string) preg_replace(
            '/[^a-z0-9ąćęłńóśźż]+/u',
            '',
            mb_strtolower(trim($str))
        );

        $localNorm = $normalize($rawName);
        if ($localNorm === '' || $localNorm === 'brak' || $localNorm === 'bezmarki') {
            return '';
        }

        if (str_contains($localNorm, 'spin')) {
            $searchQueries = ['Spinsport', 'SpinSport', 'spinsport', 'SPINSPORT', 'Spin', 'spin'];
            $targetNorms = ['spinsport', 'spin'];
            $preferredCustomName = 'Spinsport';
        } elseif (str_contains($localNorm, 'belibe')) {
            $searchQueries = ['belibe', 'BelibeSport', 'Belibe', 'Belibe Sport', 'belibesport', 'BELIBE'];
            $targetNorms = ['belibe', 'belibesport'];
            $preferredCustomName = 'BelibeSport';
        } else {
            $searchQueries = array_values(array_unique([
                $rawName,
                ucfirst(mb_strtolower($rawName)),
                mb_strtolower($rawName),
                mb_strtoupper($rawName),
            ]));
            $targetNorms = [$localNorm];
            $preferredCustomName = $rawName;
        }

        try {
            /** @var LaraditzTikTok $tiktok */
            $tiktok = app('tiktok');
            if ($shopId) {
                $tiktok->setShopId($shopId);
            } else {
                $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
                if ($defaultShopId) {
                    $tiktok->setShopId((string) $defaultShopId);
                }
            }

            $matchFromBrandsList = static function (array $brands) use ($normalize, $targetNorms): string {
                foreach ($targetNorms as $targetNorm) {
                    foreach ($brands as $b) {
                        $bId = trim((string) ($b['id'] ?? ''));
                        $bName = trim((string) ($b['name'] ?? ''));
                        if ($bId === '' || $bName === '') {
                            continue;
                        }
                        if ($normalize($bName) === $targetNorm) {
                            return $bId;
                        }
                    }
                }

                return '';
            };

            // 1. Sprawdź autoryzowane marki sklepu
            try {
                $authResponse = $tiktok->product()->brands(query: [
                    'is_authorized' => 'true',
                    'page_size' => 100,
                ]);
                $authBrands = data_get($authResponse, 'data.brands', []);
                if (is_array($authBrands) && !empty($authBrands)) {
                    $matchedId = $matchFromBrandsList($authBrands);
                    if ($matchedId !== '') {
                        $brand->tiktok_brand_id = $matchedId;
                        $brand->save();

                        return $matchedId;
                    }
                }
            } catch (\Throwable) {
                // Kontynuuj wyszukiwanie po nazwie
            }

            // 2. Wyszukaj markę po `brand_name` w katalogu TikTok Shop
            foreach ($searchQueries as $queryName) {
                $queryVariants = [
                    ['brand_name' => $queryName, 'page_size' => 100],
                ];
                if ($categoryId) {
                    $queryVariants[] = [
                        'brand_name' => $queryName,
                        'category_id' => $categoryId,
                        'page_size' => 100,
                    ];
                }

                foreach ($queryVariants as $queryParams) {
                    try {
                        $response = $tiktok->product()->brands(query: $queryParams);
                        $foundBrands = data_get($response, 'data.brands', []);
                        if (is_array($foundBrands) && !empty($foundBrands)) {
                            $matchedId = $matchFromBrandsList($foundBrands);
                            if ($matchedId !== '') {
                                $brand->tiktok_brand_id = $matchedId;
                                $brand->save();

                                return $matchedId;
                            }
                        }
                    } catch (\Throwable) {
                        // Próbuj kolejny wariant
                    }
                }
            }

            // 3. Fallback: utwórz/pobierz niestandardową markę przez POST /product/202309/brands
            try {
                $createResp = $tiktok->product()->createBrand(body: [
                    'name' => $preferredCustomName,
                ]);
                $createdId = trim((string) data_get($createResp, 'data.id', ''));
                if ($createdId !== '') {
                    $brand->tiktok_brand_id = $createdId;
                    $brand->save();

                    return $createdId;
                }
            } catch (\Throwable) {
                // Jeśli się nie powiedzie, zwracamy pusty string (produkt utworzy się bez marki zamiast rzucać błąd)
            }
        } catch (\Throwable) {
            // Ignorujemy błąd komunikacji z API marek
        }

        return '';
    }

    /**
     * Resolve a valid numeric (Int64 string) TikTok Warehouse ID.
     * If `TIKTOK_WAREHOUSE_ID` in `.env` is missing or not numeric (e.g. Seller Center internal UUID),
     * automatically fetches the default active SALES_WAREHOUSE from TikTok Shop API (`/logistics/202309/warehouses`).
     */
    public function resolveWarehouseId(?string $shopId = null): string
    {
        $configured = trim((string) config('tiktok.warehouse_id'));
        if ($configured !== '' && ctype_digit($configured)) {
            return $configured;
        }

        try {
            /** @var LaraditzTikTok $tiktok */
            $tiktok = app('tiktok');
            if ($shopId) {
                $tiktok->setShopId($shopId);
            } else {
                $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
                if ($defaultShopId) {
                    $tiktok->setShopId((string) $defaultShopId);
                }
            }

            $response = $tiktok->product()->warehouses();
            $warehouses = data_get($response, 'data.warehouses', []);
            if (is_array($warehouses) && !empty($warehouses)) {
                // Prefer default sales warehouse
                foreach ($warehouses as $wh) {
                    $id = trim((string) ($wh['id'] ?? ''));
                    $type = (string) ($wh['type'] ?? '');
                    $isDefault = (bool) ($wh['is_default'] ?? false);
                    if ($id !== '' && $isDefault && ($type === '' || $type === 'SALES_WAREHOUSE')) {
                        return $id;
                    }
                }

                // Fallback to any sales warehouse
                foreach ($warehouses as $wh) {
                    $id = trim((string) ($wh['id'] ?? ''));
                    $type = (string) ($wh['type'] ?? '');
                    if ($id !== '' && ($type === '' || $type === 'SALES_WAREHOUSE')) {
                        return $id;
                    }
                }

                // Fallback to first warehouse
                $firstId = trim((string) ($warehouses[0]['id'] ?? ''));
                if ($firstId !== '') {
                    return $firstId;
                }
            }
        } catch (\Throwable) {
            // Fall back to configured value if API call fails
        }

        return $configured;
    }

    /**
     * Resolve Manufacturer ID from config or TikTok Compliance API if empty.
     */
    public function resolveManufacturerId(?string $shopId = null): string
    {
        $configured = trim((string) config('tiktok.manufacturer_id'));
        if ($configured !== '') {
            return $configured;
        }

        try {
            /** @var LaraditzTikTok $tiktok */
            $tiktok = app('tiktok');
            if ($shopId) {
                $tiktok->setShopId($shopId);
            } else {
                $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
                if ($defaultShopId) {
                    $tiktok->setShopId((string) $defaultShopId);
                }
            }

            foreach (['searchManufacturers', 'searchManufacturersV202409'] as $method) {
                foreach (['seller', 'product'] as $service) {
                    try {
                        $response = $tiktok->{$service}()->{$method}(
                            query: ['page_size' => 20],
                            body: ['keyword' => '']
                        );
                        $items = data_get($response, 'data.manufacturers', []);
                        if (is_array($items) && !empty($items)) {
                            $id = trim((string) ($items[0]['id'] ?? $items[0]['manufacturer_id'] ?? ''));
                            if ($id !== '') {
                                return $id;
                            }
                        }
                    } catch (\Throwable) {
                        // Try next combination
                    }
                }
            }
        } catch (\Throwable) {
            // Fall back to configured
        }

        return $configured;
    }

    /**
     * Resolve Responsible Person ID from config or TikTok Compliance API if empty.
     */
    public function resolveResponsiblePersonId(?string $shopId = null): string
    {
        $configured = trim((string) config('tiktok.responsible_person_id'));
        if ($configured !== '') {
            return $configured;
        }

        try {
            /** @var LaraditzTikTok $tiktok */
            $tiktok = app('tiktok');
            if ($shopId) {
                $tiktok->setShopId($shopId);
            } else {
                $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
                if ($defaultShopId) {
                    $tiktok->setShopId((string) $defaultShopId);
                }
            }

            foreach (['searchResponsiblePersons', 'searchResponsiblePersonsV202409'] as $method) {
                foreach (['seller', 'product'] as $service) {
                    try {
                        $response = $tiktok->{$service}()->{$method}(
                            query: ['page_size' => 20],
                            body: ['keyword' => '']
                        );
                        $items = data_get($response, 'data.responsible_persons', []);
                        if (is_array($items) && !empty($items)) {
                            $id = trim((string) ($items[0]['id'] ?? $items[0]['responsible_person_id'] ?? ''));
                            if ($id !== '') {
                                return $id;
                            }
                        }
                    } catch (\Throwable) {
                        // Try next combination
                    }
                }
            }
        } catch (\Throwable) {
            // Fall back to configured
        }

        return $configured;
    }

    /**
     * Resolve an existing TikTok size chart template ID or create a new template in TikTok Shop
     * by sending structured table data (table.headers & table.rows) via Create Size Chart V2 API.
     */
    public function resolveOrSyncSizeChartTemplateId(
        ProductSizeChart $sizeChart,
        string $categoryId,
        ?string $shopId = null
    ): string {
        if (!empty($sizeChart->tiktok_template_id)) {
            return trim((string) $sizeChart->tiktok_template_id);
        }

        $body = $this->buildSizeChartPayload($sizeChart, $categoryId);

        /** @var LaraditzTikTok $tiktok */
        $tiktok = app('tiktok');
        if ($shopId) {
            $tiktok->setShopId($shopId);
        } else {
            $defaultShopId = config('tiktok.shop_id') ?: TiktokShop::query()->value('id');
            if ($defaultShopId) {
                $tiktok->setShopId((string) $defaultShopId);
            }
        }

        try {
            $response = $tiktok->product()->createSizeChart(body: $body);
        } catch (TikTokAPIError $e) {
            // Jeśli szablon o tej nazwie już istnieje w TikTok Shop (12052127),
            // spróbujmy go odnaleźć lub utwórzmy z unikalną nazwą zawierającą ID.
            if ((string) $e->getCode() === '12052127' || str_contains($e->getMessage(), 'duplicate name')) {
                $existingId = $this->findExistingSizeChartTemplateId($tiktok, $sizeChart->name);
                if ($existingId !== '') {
                    $sizeChart->tiktok_template_id = $existingId;
                    $sizeChart->save();

                    return $existingId;
                }

                $body['template_name'] = trim($sizeChart->name) . ' #' . ($sizeChart->id ?: time());
                try {
                    $response = $tiktok->product()->createSizeChart(body: $body);
                } catch (TikTokAPIError $retryException) {
                    if ((string) $retryException->getCode() === '12052127' || str_contains($retryException->getMessage(), 'duplicate name')) {
                        $body['template_name'] = trim($sizeChart->name) . ' #' . ($sizeChart->id ?: '1') . '-' . time();
                        $response = $tiktok->product()->createSizeChart(body: $body);
                    } else {
                        throw $retryException;
                    }
                }
            } else {
                throw $e;
            }
        }

        $templateId = trim((string) (
            data_get($response, 'data.size_chart_id')
            ?? data_get($response, 'data.id')
            ?? ''
        ));

        if ($templateId !== '') {
            $sizeChart->tiktok_template_id = $templateId;
            $sizeChart->save();
        }

        return $templateId;
    }

    /**
     * Try to find an existing size chart template ID in TikTok Shop by name.
     */
    protected function findExistingSizeChartTemplateId(LaraditzTikTok $tiktok, string $templateName): string
    {
        try {
            $searchResponse = $tiktok->product()->searchSizeCharts(
                query: ['page_size' => 50],
                body: ['keyword' => trim($templateName)]
            );

            $charts = data_get($searchResponse, 'data.size_chart', [])
                ?: data_get($searchResponse, 'data.size_charts', []);

            if (is_array($charts)) {
                foreach ($charts as $chart) {
                    $name = trim((string) ($chart['template_name'] ?? $chart['name'] ?? ''));
                    $id = trim((string) ($chart['size_chart_id'] ?? $chart['template_id'] ?? $chart['id'] ?? ''));
                    if ($id !== '' && ($name === '' || mb_strtolower($name) === mb_strtolower(trim($templateName)))) {
                        return $id;
                    }
                }
            }
        } catch (\Throwable) {
            // Ignorujemy błąd wyszukiwania i przechodzimy do fallbacku z unikalną nazwą
        }

        return '';
    }

    /**
     * Build structured size chart payload (`size_chart_data` with `table.headers` and `table.rows`)
     * by transposing local `ProductSizeChart::table_data` (where columns are sizes and rows are parameters)
     * into TikTok Shop's table schema (where headers are parameters and rows are sizes).
     */
    public function buildSizeChartPayload(ProductSizeChart $sizeChart, string $categoryId): array
    {
        $tableData = is_array($sizeChart->table_data) ? $sizeChart->table_data : [];
        $localHeaders = array_values($tableData['headers'] ?? []);
        $localRows = array_values($tableData['rows'] ?? []);

        if (count($localHeaders) < 2) {
            throw new InvalidArgumentException("Tabela rozmiarów '{$sizeChart->name}' musi posiadać co najmniej jedną kolumnę z rozmiarem.");
        }

        $primarySizeHeaderName = trim((string) ($localHeaders[0] ?? 'Rozmiar')) ?: 'Rozmiar';

        $tiktokHeaders = [
            [
                'id' => 'size_chart_size_system_size',
                'name' => $primarySizeHeaderName,
            ],
        ];

        foreach ($localRows as $localRow) {
            if (!is_array($localRow) || empty($localRow)) {
                continue;
            }
            $paramName = trim((string) ($localRow[0] ?? ''));
            if ($paramName === '') {
                continue;
            }

            if (mb_strtolower($paramName) === 'rozmiar eu') {
                $tiktokHeaders[] = [
                    'id' => 'size_chart_size_system_eu',
                    'name' => $paramName,
                ];
            } else {
                $tiktokHeaders[] = [
                    'name' => $paramName,
                ];
            }
        }

        $tiktokRows = [];
        $sizeCount = count($localHeaders);

        for ($colIdx = 1; $colIdx < $sizeCount; $colIdx++) {
            $sizeLabel = trim((string) ($localHeaders[$colIdx] ?? ''));
            if ($sizeLabel === '') {
                continue;
            }

            $cells = [
                ['value' => $sizeLabel],
            ];

            foreach ($localRows as $localRow) {
                if (!is_array($localRow) || empty($localRow) || trim((string) ($localRow[0] ?? '')) === '') {
                    continue;
                }
                $cells[] = [
                    'value' => trim((string) ($localRow[$colIdx] ?? '')),
                ];
            }

            $tiktokRows[] = [
                'cells' => $cells,
            ];
        }

        $payload = [
            'category_id' => $categoryId,
            'size_chart_mode' => 'REUSABLE_TEMPLATE',
            'template_name' => trim((string) $sizeChart->name),
            'is_one_size' => false,
            'size_chart_data' => [
                'measurement_type' => 'BODY_MEASUREMENTS',
                'unit_system' => 'METRIC',
                'size_types' => ['size_chart_size_type_regular'],
                'table' => [
                    'headers' => $tiktokHeaders,
                    'rows' => $tiktokRows,
                ],
            ],
        ];

        if (!empty($sizeChart->tiktok_template_id)) {
            $payload['size_chart_id'] = trim((string) $sizeChart->tiktok_template_id);
        }

        return $payload;
    }

    /**
     * Map local Product records (size variants) into TikTok Shop SKUs array.
     *
     * - Product.symbol -> seller_sku
     * - Product.mainBarcode.barcode -> identifier_code (EAN)
     * - Product.size.name -> 1-level sales_attributes (Rozmiar)
     * - Product.available_b2c -> inventory[].quantity
     */
    public function mapSkus(
        Collection $products,
        int $grossPriceCents,
        string $warehouseId,
        Collection $existingSkusByProductId,
        Collection $existingSkusBySellerSku
    ): array {
        $currency = (string) config('tiktok.currency', 'PLN');
        $sizeAttributeName = (string) config('tiktok.size_attribute_name', 'Rozmiar');
        $formattedPrice = number_format($grossPriceCents / 100, 2, '.', '');

        return $products->map(function (Product $product) use (
            $currency,
            $sizeAttributeName,
            $formattedPrice,
            $warehouseId,
            $existingSkusByProductId,
            $existingSkusBySellerSku
        ) {
            $sellerSku = trim((string) $product->symbol);
            if ($sellerSku === '') {
                throw new InvalidArgumentException("Produkt ID {$product->id} nie posiada symbolu (SKU).");
            }

            $sizeName = trim((string) ($product->size?->name ?? ''));
            if ($sizeName === '') {
                throw new InvalidArgumentException("Produkt ID {$product->id} ({$sellerSku}) nie posiada przypisanego rozmiaru.");
            }

            $barcode = trim((string) (
                $product->mainBarcode?->barcode
                ?? $product->barcodes->where('main', 1)->first()?->barcode
                ?? $product->barcodes->first()?->barcode
                ?? ''
            ));

            if ($barcode === '') {
                throw new InvalidArgumentException("Produkt ID {$product->id} ({$sellerSku}) nie posiada głównego kodu EAN.");
            }

            $availableQuantity = max(0, (int) $product->available_b2c);

            $skuData = [
                'seller_sku' => $sellerSku,
                'sales_attributes' => [
                    [
                        'name' => $sizeAttributeName,
                        'value_name' => $sizeName,
                    ],
                ],
                'price' => [
                    'amount' => $formattedPrice,
                    'currency' => $currency,
                ],
                'inventory' => [
                    [
                        'warehouse_id' => $warehouseId,
                        'quantity' => $availableQuantity,
                    ],
                ],
                'identifier_code' => [
                    'code' => $barcode,
                    'type' => 'EAN',
                ],
            ];

            $existingSku = $existingSkusByProductId->get($product->id)
                ?? $existingSkusBySellerSku->get($sellerSku);

            if ($existingSku && !empty($existingSku->id) && !str_starts_with((string) $existingSku->id, 'pending_')) {
                $skuData['id'] = (string) $existingSku->id;
            }

            return $skuData;
        })->values()->all();
    }
}

