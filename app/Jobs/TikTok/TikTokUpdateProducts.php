<?php

namespace App\Jobs\TikTok;

use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokUpdateProducts implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $colorIds = Product::query()
            ->whereHas('b2cStat', function ($query) {
                $query->where('create_in_tiktok', 1);
            })
            ->whereNotNull('product_model_color_id')
            ->distinct()
            ->pluck('product_model_color_id');

        foreach ($colorIds as $colorId) {
            TikTokPublishProductColor::dispatch((int) $colorId);
        }
    }
}

