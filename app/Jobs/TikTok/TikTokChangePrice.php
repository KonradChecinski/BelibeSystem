<?php

namespace App\Jobs\TikTok;

use App\Models\Products\ProductModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TikTokChangePrice implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private ProductModel $productModel;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModel $productModel)
    {
        $this->onQueue('linux');
        $this->productModel = $productModel;
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return (string) $this->productModel->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $products = $this->productModel->productsWithoutRelation
            ->filter(fn ($product) => (bool) $product->show_in_tiktok);

        foreach ($products as $product) {
            if ($product->b2cStat) {
                $product->b2cStat->update([
                    'create_in_tiktok' => 1,
                ]);
            } else {
                $product->b2cStat()->create([
                    'create_in_tiktok' => 1,
                ]);
            }
        }
    }
}

