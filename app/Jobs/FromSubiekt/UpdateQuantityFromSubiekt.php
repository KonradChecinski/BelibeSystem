<?php

namespace App\Jobs\FromSubiekt;

use App\Models\Products\Product;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateQuantityFromSubiekt //implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $products = Product::where("subiekt_id", "!=", null)->get();
        foreach ($products as $product) {
            $productSubiekt = Towar::find($product->subiekt_id);
            $stan = $productSubiekt->stany->sum("st_Stan");
            $product->update([
                "quantity" => $stan
            ]);
            $product->save();
        }
    }
}
