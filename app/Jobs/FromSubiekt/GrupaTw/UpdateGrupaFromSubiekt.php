<?php

namespace App\Jobs\FromSubiekt\GrupaTw;

use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateGrupaFromSubiekt implements ShouldQueue
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
//        $products = Product::where("subiekt_id", "!=", null)->get();
//        foreach ($products as $product) {
//            $productSubiekt = Towar::find($product->subiekt_id);
//            $stan = $productSubiekt->stany->sum("st_Stan");
//            $stanWszystkie = $productSubiekt->stanyWszystkie->sum("st_Stan");
//            $product->update([
//                "quantity" => $stan,
//                "quantity_total" => $stanWszystkie,
//            ]);
//            $product->save();
//        }
    }
}
