<?php

namespace App\Helpers\TikTok;

use App\Models\Products\Product;
use App\Models\TikTok\TiktokProduct;
use App\Models\TikTok\TiktokProductSku;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Service responsible for synchronizing inventory (Product.available_b2c) and prices with TikTok Shop.
 * Designed for Stage 1 (update offers) and Stage 2 (periodic stock sync of changed SKUs).
 */
class TikTokInventorySyncService
{
    public function __construct(
        protected TikTokProductPublisher $publisher
    )
    {
    }

    /**
     * Synchronize inventory for a collection of local Product variants grouped by their published TikTok product.
     * Uses POST /product/202309/products/{product_id}/inventory/update via laraditz/tiktok.
     */
    public function syncInventoryForProducts(Collection $products, ?string $shopId = null): void
    {
        $warehouseId = trim((string)config('tiktok.warehouse_id'));
        if ($warehouseId === '') {
            throw new \InvalidArgumentException('Brak skonfigurowanego identyfikatora magazynu TikTok (TIKTOK_WAREHOUSE_ID).');
        }

        $tiktok = $this->publisher->resolveTikTokClient($shopId);

        $products->loadMissing(['tiktokSku', 'color.tiktokProduct']);

        $groupedByTiktokProduct = $products->groupBy(function (Product $product) {
            return $product->tiktokSku?->product_id ?? $product->color?->tiktokProduct?->id ?? '';
        });

        foreach ($groupedByTiktokProduct as $tiktokProductId => $productGroup) {
            if ($tiktokProductId === '' || $this->publisher->isPlaceholderId((string)$tiktokProductId)) {
                continue;
            }

            $skusPayload = [];
            /** @var Collection<int, TiktokProductSku> $skusToUpdate */
            $skusToUpdate = collect();

            foreach ($productGroup as $product) {
                $sku = $product->tiktokSku;
                if (!$sku || empty($sku->id)) {
                    continue;
                }

                $available = max(0, (int)$product->available_b2c);

                $skusPayload[] = [
                    'id' => (string)$sku->id,
                    'inventory' => [
                        [
                            'warehouse_id' => $warehouseId,
                            'quantity' => $available,
                        ],
                    ],
                ];

                $skusToUpdate->push(['sku' => $sku, 'quantity' => $available]);
            }

            if (empty($skusPayload)) {
                continue;
            }

            $tiktok->product()->updateInventory(
                params: ['product_id' => (string)$tiktokProductId],
                body: ['skus' => $skusPayload]
            );

            foreach ($skusToUpdate as $item) {
                /** @var TiktokProductSku $skuRecord */
                $skuRecord = $item['sku'];
                $skuRecord->update([
                    'last_synced_quantity' => $item['quantity'],
                    'inventory' => [
                        [
                            'warehouse_id' => $warehouseId,
                            'quantity' => $item['quantity'],
                        ],
                    ],
                ]);
            }

            TiktokProduct::where('id', $tiktokProductId)->update([
                'last_synced_at' => now(),
                'last_sync_error' => null,
            ]);
        }
    }
}

