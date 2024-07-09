<?php

namespace App\Jobs\Shoper;

use App\Helpers\Shoper\Shoper;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ShoperChangeDescription implements ShouldQueue
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
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->productModel->colors as $productModelColor) {
            $colorIds = Shoper::findIdsColor($productModelColor);
            if (is_null($colorIds)) continue;

            foreach ($colorIds as $colorId) {
                $result = Shoper::changeDescription($colorId, $productModelColor, $this->productModel->description_b2c);
                if (!$result) {
                    $this->fail('Change price failed');
                }
            }

        }

    }
}
