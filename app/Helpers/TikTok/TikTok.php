<?php

namespace App\Helpers\TikTok;

use App\Models\Products\ProductModelColor;
use App\Models\TikTok\TiktokProduct;
use Illuminate\Support\Collection;

/**
 * Facade-style helper matching App\Helpers\Empik\Empik and App\Helpers\Shoper\Shoper conventions,
 * delegating to dedicated TikTok services (Mapper, Publisher, ImageUploader, InventorySync, OrderService).
 */
class TikTok
{
    public static function publisher(): TikTokProductPublisher
    {
        return app(TikTokProductPublisher::class);
    }

    public static function mapper(): TikTokProductMapper
    {
        return app(TikTokProductMapper::class);
    }

    public static function imageUploader(): TikTokImageUploader
    {
        return app(TikTokImageUploader::class);
    }

    public static function inventorySync(): TikTokInventorySyncService
    {
        return app(TikTokInventorySyncService::class);
    }

    public static function orders(): TikTokOrderService
    {
        return app(TikTokOrderService::class);
    }

    /**
     * Publish or update a single ProductModelColor in TikTok Shop.
     */
    public static function publishOrUpdateColor(ProductModelColor $color, ?string $shopId = null): ?TiktokProduct
    {
        return self::publisher()->publishOrUpdateColor($color, $shopId);
    }

    /**
     * Synchronize inventory for a collection of Product models.
     */
    public static function syncInventory(Collection $products, ?string $shopId = null): void
    {
        self::inventorySync()->syncInventoryForProducts($products, $shopId);
    }
}

