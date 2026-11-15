<?php

namespace App\Helpers\TikTok;

use App\Models\Products\Product;
use App\Models\Products\ProductModelColor;
use App\Models\TikTok\TiktokProduct;
use App\Models\TikTok\TiktokProductSku;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laraditz\TikTok\Models\TiktokShop;
use Laraditz\TikTok\TikTok as LaraditzTikTok;
use Throwable;

class TikTokProductPublisher
{
    public function __construct(
        protected TikTokProductMapper $mapper
    ) {
    }

    /**
     * Publish or update a ProductModelColor in TikTok Shop idempotently.
     */
    public function publishOrUpdateColor(ProductModelColor $color, ?string $shopId = null): ?TiktokProduct
    {
        $tiktok = $this->resolveTikTokClient($shopId);
        $resolvedShopId = $tiktok->getShopId() ?? config('tiktok.shop_id');

        $color->loadMissing([
            'model.brand',
            'model.tiktokCategory',
            'model.prices',
            'model.sizeChart',
            'images',
            'products.size',
            'products.barcodes',
            'products.mainBarcode',
            'products.b2cStat',
        ]);

        $existingProduct = $this->findExistingTiktokProduct($color, $resolvedShopId);
        if ($existingProduct && strtoupper((string) $existingProduct->status) === 'DELETED') {
            $this->purgeDeletedRemoteProduct($existingProduct);
            $existingProduct = null;
        }
        $hasRemoteProduct = $existingProduct && !$this->isPlaceholderId($existingProduct->id);

        $activeProducts = $color->products
            ->filter(fn (Product $product) => (bool) $product->show_in_tiktok)
            ->values();

        // If all size variants in this color have been unchecked (show_in_tiktok = 0)
        if ($activeProducts->isEmpty()) {
            if ($hasRemoteProduct) {
                return $this->deactivateRemoteProduct($tiktok, $existingProduct, $color);
            }

            return $existingProduct;
        }

        try {
            $payload = $this->mapper->buildProductPayload(
                color: $color,
                existingTiktokProduct: $hasRemoteProduct ? $existingProduct : null,
                shopId: $resolvedShopId
            );

            if ($hasRemoteProduct) {
                try {
                    $result = $tiktok->product()->update(
                        params: ['product_id' => $existingProduct->id],
                        body: $payload
                    );

                    if ($existingProduct->status === 'SELLER_DEACTIVATED') {
                        $tiktok->product()->activate(
                            body: ['product_ids' => [(string) $existingProduct->id]]
                        );
                    }

                    $remoteProductId = (string) (data_get($result, 'data.product_id') ?: $existingProduct->id);
                } catch (Throwable $updateException) {
                    // Jeśli produkt został usunięty w panelu TikTok Seller Center, a w BelibeSystem jest nadal zaznaczony,
                    // wyczyść stary wpis i utwórz produkt od nowa
                    if (!$this->isRemoteProductDeletedOrMissingError($updateException)) {
                        throw $updateException;
                    }

                    $this->purgeDeletedRemoteProduct($existingProduct);
                    $existingProduct = null;
                    $hasRemoteProduct = false;

                    $payload = $this->mapper->buildProductPayload(
                        color: $color,
                        existingTiktokProduct: null,
                        shopId: $resolvedShopId
                    );

                    $result = $tiktok->product()->create(
                        body: $payload
                    );

                    $remoteProductId = (string) data_get($result, 'data.product_id', '');
                    if ($remoteProductId === '') {
                        throw new \RuntimeException('TikTok Shop API nie zwróciło identyfikatora product_id po odtworzeniu usuniętego produktu.');
                    }
                }
            } else {
                $result = $tiktok->product()->create(
                    body: $payload
                );

                $remoteProductId = (string) data_get($result, 'data.product_id', '');
                if ($remoteProductId === '') {
                    throw new \RuntimeException('TikTok Shop API nie zwróciło identyfikatora product_id po utworzeniu produktu.');
                }
            }

            $remoteSkus = (array) data_get($result, 'data.skus', []);

            return $this->persistPublishedState(
                color: $color,
                activeProducts: $activeProducts,
                payload: $payload,
                remoteProductId: $remoteProductId,
                remoteSkus: $remoteSkus,
                shopId: $resolvedShopId,
                existingProduct: $existingProduct
            );
        } catch (Throwable $e) {
            $this->recordSyncFailure($color, $existingProduct, $resolvedShopId, $e);

            Log::error('TikTok Shop product publish/update failed', [
                'product_model_color_id' => $color->id,
                'shop_id' => $resolvedShopId,
                'tiktok_product_id' => $existingProduct?->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Deactivate an already published TikTok product when all its size variants are unchecked.
     */
    protected function deactivateRemoteProduct(
        LaraditzTikTok $tiktok,
        TiktokProduct $existingProduct,
        ProductModelColor $color
    ): ?TiktokProduct {
        try {
            $tiktok->product()->deactivate(
                body: ['product_ids' => [(string) $existingProduct->id]]
            );

            $existingProduct->update([
                'status' => 'SELLER_DEACTIVATED',
                'sync_status' => 'deactivated',
                'last_sync_error' => null,
                'last_synced_at' => now(),
            ]);

            return $existingProduct;
        } catch (Throwable $e) {
            if ($this->isRemoteProductDeletedOrMissingError($e)) {
                $this->purgeDeletedRemoteProduct($existingProduct);

                return null;
            }

            $this->recordSyncFailure($color, $existingProduct, $existingProduct->shop_id, $e);
            throw $e;
        }
    }

    /**
     * Check if a TikTok API exception means the remote product was deleted or no longer exists in TikTok Shop.
     */
    public function isRemoteProductDeletedOrMissingError(Throwable $e): bool
    {
        $code = (string) $e->getCode();
        $missingCodes = [
            '12052260', // product id not exist
            '12052048', // product id not exist
            '12052003', // product status is deleted / invalid
            '12052004', // product does not exist
            '12052013', // product status invalid (deleted)
            '12052093', // product is deleted
        ];

        if (in_array($code, $missingCodes, true)) {
            return true;
        }

        $msg = mb_strtolower($e->getMessage());

        return str_contains($msg, 'product id not exist')
            || str_contains($msg, 'product does not exist')
            || str_contains($msg, 'product not exist')
            || str_contains($msg, 'product is deleted')
            || str_contains($msg, 'status is deleted')
            || str_contains($msg, 'already deleted')
            || str_contains($msg, 'has been deleted');
    }

    /**
     * Force-delete local TiktokProduct and its TiktokProductSku records when remote product was deleted on TikTok.
     */
    public function purgeDeletedRemoteProduct(TiktokProduct $product): void
    {
        DB::transaction(function () use ($product) {
            TiktokProductSku::withTrashed()
                ->where('product_id', $product->id)
                ->forceDelete();

            $product->forceDelete();
        });
    }

    /**
     * Find an existing TiktokProduct for a ProductModelColor (by color ID or by existing SKU symbols)
     * to guarantee idempotency and prevent duplicate products.
     */
    public function findExistingTiktokProduct(ProductModelColor $color, ?string $shopId = null): ?TiktokProduct
    {
        $query = TiktokProduct::query()
            ->where('product_model_color_id', $color->id);

        if ($shopId) {
            $query->where(function ($q) use ($shopId) {
                $q->where('shop_id', $shopId)->orWhereNull('shop_id');
            });
        }

        // Prefer non-placeholder (real remote) record if multiple exist
        $existing = $query->orderByRaw("CASE WHEN id LIKE 'failed_color_%' THEN 1 ELSE 0 END")
            ->latest('updated_at')
            ->first();

        if ($existing) {
            return $existing;
        }

        // Fallback: check if any SKU of this color is already in tiktok_product_skus (e.g. synced from TikTok API)
        $productIds = $color->products->pluck('id')->filter()->values()->all();
        $symbols = $color->products->pluck('symbol')->filter()->values()->all();

        $matchedSku = TiktokProductSku::query()
            ->where(function ($q) use ($productIds, $symbols) {
                if (!empty($productIds)) {
                    $q->whereIn('local_product_id', $productIds);
                }
                if (!empty($symbols)) {
                    $q->orWhereIn('seller_sku', $symbols);
                }
            })
            ->whereNotNull('product_id')
            ->first();

        if ($matchedSku && $matchedSku->product_id) {
            $parentProduct = TiktokProduct::query()->find($matchedSku->product_id);
            if ($parentProduct) {
                $parentProduct->product_model_color_id = $color->id;
                $parentProduct->save();

                return $parentProduct;
            }
        }

        return null;
    }

    /**
     * Persist published TikTok Product ID and SKU IDs linked to local ProductModelColor and Product records.
     */
    protected function persistPublishedState(
        ProductModelColor $color,
        $activeProducts,
        array $payload,
        string $remoteProductId,
        array $remoteSkus,
        ?string $shopId,
        ?TiktokProduct $existingProduct = null
    ): TiktokProduct {
        return DB::transaction(function () use (
            $color,
            $activeProducts,
            $payload,
            $remoteProductId,
            $remoteSkus,
            $shopId,
            $existingProduct
        ) {
            if ($existingProduct && $this->isPlaceholderId($existingProduct->id) && $existingProduct->id !== $remoteProductId) {
                $existingProduct->forceDelete();
            }

            $tiktokProduct = TiktokProduct::withTrashed()->updateOrCreate(
                ['id' => $remoteProductId],
                [
                    'shop_id' => $shopId,
                    'product_model_color_id' => $color->id,
                    'title' => $payload['title'] ?? $color->b2c_product_name,
                    'status' => 'ACTIVATE',
                    'sync_status' => 'published',
                    'last_sync_error' => null,
                    'last_synced_at' => now(),
                ]
            );

            if ($tiktokProduct->trashed()) {
                $tiktokProduct->restore();
            }

            $productsBySymbol = $activeProducts->keyBy(fn (Product $p) => trim((string) $p->symbol));
            $payloadSkusBySymbol = collect($payload['skus'] ?? [])->keyBy('seller_sku');

            foreach ($remoteSkus as $remoteSku) {
                $remoteSkuId = (string) data_get($remoteSku, 'id', '');
                $sellerSku = trim((string) data_get($remoteSku, 'seller_sku', ''));

                if ($remoteSkuId === '') {
                    continue;
                }

                /** @var Product|null $localProduct */
                $localProduct = $productsBySymbol->get($sellerSku);
                $payloadSku = $payloadSkusBySymbol->get($sellerSku, []);

                $skuRecord = TiktokProductSku::withTrashed()->updateOrCreate(
                    ['id' => $remoteSkuId],
                    [
                        'product_id' => $remoteProductId,
                        'local_product_id' => $localProduct?->id,
                        'seller_sku' => $sellerSku ?: ($localProduct?->symbol),
                        'inventory' => data_get($payloadSku, 'inventory'),
                        'last_synced_quantity' => $localProduct ? max(0, (int) $localProduct->available_b2c) : null,
                        'price' => data_get($payloadSku, 'price'),
                    ]
                );

                if ($skuRecord->trashed()) {
                    $skuRecord->restore();
                }
            }

            return $tiktokProduct;
        });
    }

    /**
     * Save failed status and error message on TiktokProduct so failed publications are distinguishable.
     */
    protected function recordSyncFailure(
        ProductModelColor $color,
        ?TiktokProduct $existingProduct,
        ?string $shopId,
        Throwable $e
    ): TiktokProduct {
        $recordId = ($existingProduct && !empty($existingProduct->id))
            ? $existingProduct->id
            : 'failed_color_' . $color->id;

        return TiktokProduct::withTrashed()->updateOrCreate(
            ['id' => $recordId],
            [
                'shop_id' => $shopId,
                'product_model_color_id' => $color->id,
                'title' => $color->b2c_product_name ?: (($color->model?->name ?? '') . ' - ' . $color->name),
                'sync_status' => 'failed',
                'last_sync_error' => $e->getMessage(),
            ]
        );
    }

    public function isPlaceholderId(?string $id): bool
    {
        if (!$id) {
            return true;
        }

        return str_starts_with($id, 'failed_color_') || str_starts_with($id, 'pending_');
    }

    /**
     * Resolve and initialize Laraditz TikTok service with active shop.
     */
    public function resolveTikTokClient(?string $shopId = null): LaraditzTikTok
    {
        /** @var LaraditzTikTok $tiktok */
        $tiktok = app('tiktok');

        if ($shopId) {
            $tiktok->setShopId($shopId);
        }

        $tiktok->checkShop();

        if (!$tiktok->getShop()) {
            $fallbackShop = TiktokShop::query()->first();
            if ($fallbackShop) {
                $tiktok->setShop($fallbackShop);
                $tiktok->setShopId($fallbackShop->id);
                $tiktok->setShopCode($fallbackShop->code);
                $tiktok->setShopName($fallbackShop->name);
                if ($fallbackShop->accessToken?->access_token) {
                    $tiktok->setAccessToken($fallbackShop->accessToken->access_token);
                }
            }
        }

        return $tiktok;
    }
}

