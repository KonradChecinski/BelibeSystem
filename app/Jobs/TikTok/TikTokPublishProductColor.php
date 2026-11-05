<?php

namespace App\Jobs\TikTok;

use App\Helpers\TikTok\TikTok;
use App\Models\Products\ProductModelColor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokPublishProductColor implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 30;
    public $timeout = 120;

    private int $productModelColorId;
    private ?string $shopId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productModelColorId, ?string $shopId = null)
    {
        $this->onQueue('linux');
        $this->productModelColorId = $productModelColorId;
        $this->shopId = $shopId;
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return 'tiktok_color_' . $this->productModelColorId . '_' . ($this->shopId ?? 'default');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $color = ProductModelColor::with([
            'model.brand',
            'model.tiktokCategory',
            'model.prices',
            'images',
            'products.size',
            'products.barcodes',
            'products.mainBarcode',
            'products.b2cStat',
        ])->find($this->productModelColorId);

        if (!$color) {
            return;
        }

        TikTok::publishOrUpdateColor($color, $this->shopId);

        foreach ($color->products as $product) {
            if ($product->b2cStat) {
                $product->b2cStat->update([
                    'create_in_tiktok' => 0,
                    'update_in_tiktok' => 0,
                ]);
            }
        }
    }
}

