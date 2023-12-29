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

class ShoperChangeImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private ProductModelColor $productModelColor;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModelColor $productModelColor)
    {
        $this->onQueue('linux');
        $this->productModelColor = $productModelColor;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $shoperProductId = Shoper::findIdColor($this->productModelColor);
        $resultDeleting = Shoper::deleteImages($shoperProductId);
        $resultAdding = Shoper::addImages($shoperProductId, $this->productModelColor);
        if (!$resultDeleting || !$resultAdding) {
            $this->fail('Change images failed');
        }
    }
}
