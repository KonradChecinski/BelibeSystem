<?php

namespace App\Jobs\FromSubiekt\Stan;

use App\Jobs\Quantity\ChangeQuantity;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdateProductQuantityFromSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    public Product $product;

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

        $productSubiekt = $this->product->towar;
        $stan = $productSubiekt->stany->sum("st_Stan");
        $stanWszystkie = $productSubiekt->stanyWszystkie->sum("st_Stan");


        $this->product->update([
            "quantity" => $stan,
            "quantity_total" => $stanWszystkie,
        ]);
        $this->product->save();


        ChangeQuantity::dispatch($this->product);

    }
}
