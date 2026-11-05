<?php

namespace App\Jobs\TikTok;

use App\Helpers\TikTok\TikTok;
use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokUpdateOffers implements ShouldQueue, ShouldBeUnique
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
        $products = Product::query()
            ->with(['b2cStat', 'tiktokSku', 'color.tiktokProduct'])
            ->whereHas('b2cStat', function ($query) {
                $query->where('update_in_tiktok', 1);
            })
            ->get();

        if ($products->isEmpty()) {
            return;
        }

        TikTok::syncInventory($products);

        foreach ($products as $product) {
            if ($product->b2cStat) {
                $product->b2cStat->update([
                    'update_in_tiktok' => 0,
                ]);
            }
        }
    }
}

