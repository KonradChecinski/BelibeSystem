<?php

namespace App\Jobs\Empik;

use App\Helpers\Empik\Empik;
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

class EmpikUpdateProducts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;


    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $products = Product::query()->whereHas("b2cStat", function ($query) {
            $query->where("create_in_empik", 1);
        })->get();
        if ($products->isNotEmpty()) {
            $path = Empik::createProductsCsv($products);
            $response = Empik::updateProducts($path);

            if (!$response->successful()) {
                $this->fail('updating products failed');
            }

            foreach ($products as $product) {
                $product->b2cStat->create_in_empik = 0;
                $product->b2cStat->update_in_empik = 1;
                $product->b2cStat->save();
            }
        }
    }
}
