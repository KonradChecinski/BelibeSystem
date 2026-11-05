<?php

namespace App\Jobs\TikTok;

use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokChangeShow implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private int $productId;
    private bool $value;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productId, bool $value)
    {
        $this->onQueue('linux');
        $this->productId = $productId;
        $this->value = $value;
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return (string) $this->productId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $product = Product::find($this->productId);
        if (!$product) {
            return;
        }

        $stat = $product->b2cStat;

        if (is_null($stat)) {
            $product->b2cStat()->create([
                'create_in_tiktok' => 1,
            ]);
        } else {
            $stat->update([
                'create_in_tiktok' => 1,
            ]);
        }
    }
}

