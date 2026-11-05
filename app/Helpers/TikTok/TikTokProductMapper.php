<?php

namespace App\Helpers\TikTok;

use App\Models\Products\Product;
use App\Models\Products\ProductModelColor;
use App\Models\ProductSizeChart;
use App\Models\TikTok\TiktokProduct;
use Illuminate\Support\Collection;
use InvalidArgumentException;
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

        $warehouseId = trim((string) config('tiktok.warehouse_id'));
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

        $brandId = trim((string) ($model->brand?->tiktok_brand_id ?? ''));
        if ($brandId !== '') {
            $payload['brand_id'] = $brandId;
        }

        $manufacturerIds = array_values(array_filter([(string) config('tiktok.manufacturer_id')]));
        if (!empty($manufacturerIds)) {
            $payload['manufacturer_ids'] = $manufacturerIds;
        }

        $responsiblePersonIds = array_values(array_filter([(string) config('tiktok.responsible_person_id')]));
        if (!empty($responsiblePersonIds)) {
            $payload['responsible_person_ids'] = $responsiblePersonIds;
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

        $response = $tiktok->product()->createSizeChart(body: $body);
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

