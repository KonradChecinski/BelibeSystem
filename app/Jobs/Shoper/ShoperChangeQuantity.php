<?php

namespace App\Jobs\Shoper;

use App\Helpers\Shoper\Shoper;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ShoperChangeQuantity implements ShouldQueue
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
     * Execute the job.
     */
    public function handle(): void
    {
        $shoperStocks = Shoper::getProductsStockBySymbol($this->product);
        if (count($shoperStocks) == 0) return;
        foreach ($shoperStocks as $shoperStock) {
            $result = Shoper::changeProductStockQuantity($shoperStock["stock_id"], $this->product);
            if (!$result) {
                $this->fail('Change productStock stock failed');
            }
        }

        $shoperColors = Shoper::getProductsBySymbol($this->product->color);
        if (count($shoperColors) == 0) return;

        foreach ($shoperColors as $shoperColor) {
            $result = Shoper::changeProductQuantity($shoperColor["product_id"], $this->product->color);
            if (!$result) {
                $this->fail('Change Product stock failed');
            }
        }

    }
}
