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
        $shoperStock = Shoper::getProductStockBySymbol($this->product);
        if (count($shoperStock) == 0) return;
        $result = Shoper::changeProductStockQuantity($shoperStock[0]["stock_id"], $this->product);
        if (!$result) {
            $this->fail('Change productStock stock failed');
        }
        $shoperColorId = Shoper::getProductBySymbol($this->product->color);
        if (is_null($shoperColorId)) return;
        $result = Shoper::changeProductQuantity($shoperColorId, $this->product->color);
        if (!$result) {
            $this->fail('Change Product stock failed');
        }

    }
}
