<?php

namespace App\Helpers\TikTok;

/**
 * Architectural foundation for Stage 3: TikTok Shop Orders, Price Detail breakdown
 * (seller vs. platform discounts, vouchers, shipping, taxes), returns, and webhooks.
 *
 * Uses laraditz/tiktok OrderService (`order()->list()`, `order()->detail()`, `order()->priceDetail()`).
 */
class TikTokOrderService
{
    public function __construct(
        protected TikTokProductPublisher $publisher
    ) {
    }

    /**
     * Fetch detailed price breakdown for a TikTok order using GET /order/202407/orders/{order_id}/price_detail.
     * Distinguishes seller-funded discounts from platform-funded (TikTok) discounts and vouchers.
     */
    public function getOrderPriceDetail(string $orderId, ?string $shopId = null): array
    {
        $tiktok = $this->publisher->resolveTikTokClient($shopId);

        $response = $tiktok->order()->priceDetail(
            params: ['order_id' => $orderId]
        );

        return (array) data_get($response, 'data', []);
    }
}

