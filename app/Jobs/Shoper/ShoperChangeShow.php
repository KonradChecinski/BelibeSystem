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
use Illuminate\Support\Facades\Log;

class ShoperChangeShow implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private Product $product;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productId)
    {
        $this->onQueue('linux');
        $this->product = Product::find($productId);
    }

    public function uniqueId()
    {
        return $this->product->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $shoperStock = Shoper::getProductStockBySymbol($this->product);
        $shoperProduct = Shoper::getProductBySymbol($this->product->color);

        if (count($shoperStock) > 0) {
            //istnieje wariant
            $shoperStockId = $shoperStock[0]["stock_id"];

            Shoper::changeStockActive($shoperStockId, $this->product->show_in_b2c);

            $shoperProductId = $shoperProduct[0]["product_id"];

            if ((bool)$this->product->show_in_b2c == true) {
                Shoper::changeProductActive($shoperProductId, true);
            } else {
                if ($this->product->color->products()->where("show_in_b2c", true)->count() == 0) {
                    Shoper::changeProductActive($shoperProductId, false);
                }
            }
        } else {
            //nieistnieje wariant

            if (count($shoperProduct) > 0) {
                //Istnieje product
                $shoperProductId = $shoperProduct[0]["product_id"];
                $shoperStockId = Shoper::AddProductVariant($this->product, $shoperProductId);
                Shoper::changeStockActive($shoperStockId, $this->product->show_in_b2c);

                if ((bool)$this->product->show_in_b2c == true) {
                    Shoper::changeProductActive($shoperProductId, true);
                } else {
                    if ($this->product->color->products()->where("show_in_b2c", true)->count() == 0) {
                        Shoper::changeProductActive($shoperProductId, false);
                    }
                }
                Shoper::changeProductQuantity($shoperProductId, $this->product->color);

            } else {
                //Nie istnieje product

                $shoperCategoryId = Shoper::getCategory($this->product->model->b2cCategory->name);
                if (is_null($shoperCategoryId)) {
                    $this->fail('Cannot find Category');
                }
                $shoperProducerId = Shoper::getProducer($this->product->model->brand->name);
                if (is_null($shoperCategoryId)) {
                    $this->fail('Cannot find Producer');
                }
                $shoperProductId = Shoper::AddProduct($this->product->color, $shoperCategoryId, $shoperProducerId);
                if (is_null($shoperProductId)) {
                    $this->fail('Cannot add product');
                }
                Shoper::changeDescription($shoperProductId, $this->product->color, $this->product->model->description_b2c);
                Shoper::changeProductQuantity($shoperProductId, $this->product->color);

                $shoperStockId = Shoper::AddProductVariant($this->product, $shoperProductId);
                Shoper::changeStockActive($shoperStockId, $this->product->show_in_b2c);
                if ((bool)$this->product->show_in_b2c == true) {
                    Shoper::changeProductActive($shoperProductId, true);
                } else {
                    if ($this->product->color->products()->where("show_in_b2c", true)->count() == 0) {
                        Shoper::changeProductActive($shoperProductId, false);
                    }
                }
            }

//            return $result;
        };


        $shoperStock = Shoper::getProductStockBySymbol($this->product);
        if (count($shoperStock) == 0) return;
        $result = Shoper::changeProductStockQuantity($shoperStock[0]["stock_id"], $this->product);
        if (!$result) {
            $this->fail('Change productStock stock failed');
        }
        $shoperColorId = Shoper::findIdColor($this->product->color);
        if (is_null($shoperColorId)) return;
        $result = Shoper::changeProductQuantity($shoperColorId, $this->product->color);
        if (!$result) {
            $this->fail('Change Product stock failed');
        }

    }
}
