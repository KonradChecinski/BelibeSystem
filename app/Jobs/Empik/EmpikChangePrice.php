<?php

namespace App\Jobs\Empik;

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

class EmpikChangePrice implements ShouldQueue, ShouldBeUnique
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
        return $this->productModel->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $products = $this->productModel->productsWithoutRelation;
        $products = $products->filter(function ($product) {
            return $product->show_in_empik == 1;
        });

        foreach ($products as $product) {
            $product->b2cStat->update([
                'update_in_empik' => 1,
            ]);
        }

    }
}
