<?php

namespace App\Jobs\TikTok;

use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokChangeQuantity implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private Product $product;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->onQueue('linux');
        $this->product = $product;
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return (string) $this->product->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (!$this->product->show_in_tiktok) {
            return;
        }

        if ($this->product->b2cStat) {
            $this->product->b2cStat->update([
                'update_in_tiktok' => 1,
            ]);
        } else {
            $this->product->b2cStat()->create([
                'update_in_tiktok' => 1,
            ]);
        }
    }
}

