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

class ShoperChangeName implements ShouldQueue, ShouldBeUnique
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

    public function uniqueId()
    {
        return $this->productModelColor->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->productModelColor->products()->where("show_in_b2c", true)->count() !== 0) {

            $colorId = Shoper::findIdColor($this->productModelColor);
            if (is_null($colorId)) $this->fail("Cannot find color");

            $result = Shoper::changeName($colorId, $this->productModelColor->b2c_product_name);
            if (!$result) {
                $this->fail('Change price failed');
            }
        }

    }
}
