<?php

namespace App\Jobs\FromSubiekt\Cena;

use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdatePriceFromSubiekt implements ShouldQueue
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
        $updatedPriceTowars = DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->get();

        foreach ($updatedPriceTowars as $updatedPriceTowar) {
            $towar = Towar::find($updatedPriceTowar->id);
            if ($towar == null) {
                DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->where("id", $updatedPriceTowar->id)->delete();
                continue;
            }
            $cena = $towar->cena;

            $product = Product::findBySubiektId($updatedPriceTowar->id);

            if ($product == null) {
                DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->where("id", $updatedPriceTowar->id)->delete();
                continue;
            }
//            dd($cena, $product, $product->model->prices);
//            dd($towar, $product, $cena);
            $product->model->prices->update([
                "wholesale_net_price" => $cena->tc_CenaNetto2 * 100,
                "wholesale_gross_price" => $cena->tc_CenaBrutto2 * 100,
                "retail_net_price" => $cena->tc_CenaNetto3 * 100,
                "retail_gross_price" => $cena->tc_CenaBrutto3 * 100,
            ]);
            $product->save();

            DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->where("id", $product->subiekt_id)->delete();

            ChangePriceInModelInSubiekt::dispatch($product->model);
        }
    }
}

