<?php

namespace App\Jobs\Quantity;

use App\Helpers\Shoper\Shoper;
use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Empik\EmpikChangeQuantity;
use App\Jobs\Shoper\ShoperChangeQuantity;
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

class UpdateAllQuantities implements ShouldQueue
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
        $products = Product::query()->whereNotNull("subiekt_id")->get();


        foreach ($products as $product) {
            if (!is_null($product->towar) && (float)$product->quantity !== (float)$product->towar->stany->sum("st_Stan")) {
//                print($product->symbol . "\n");
//                dd($product, $product->symbol, (float)$product->quantity, (float)$product->towar->stany->sum("st_Stan"));
                $product->quantity = $product->towar->stany->sum("st_Stan");
                $product->save();
                ChangeQuantity::dispatch($product);
            }
        }
    }
}
