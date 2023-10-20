<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\ProductModel;
use App\Models\Subiekt\Cena;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ChangePriceInModelInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productModel;
    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModel $productModel)
    {
        $this->onQueue('linux');
        $this->productModel = $productModel;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $products = $this->productModel->products;
        $prices = $this->productModel->prices;

        foreach ($products as $product) {
            if (is_null($product->subiekt_id)) continue;

            $cena = Cena::findByProductId($product->subiekt_id);

            $cena->update([
                "tc_CenaNetto2" => $prices->wholesale_net_price / 100,
                "tc_CenaBrutto2" => $prices->wholesale_gross_price / 100,
                "tc_CenaNetto3" => $prices->retail_net_price / 100,
                "tc_CenaBrutto3" => $prices->retail_gross_price / 100,
            ]);

            DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->where("id", $product->subiekt_id)->delete();

            $cena->save();


        }
    }
}
