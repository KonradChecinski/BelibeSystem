<?php

namespace App\Jobs\FromSubiekt;

use App\Jobs\ToSubiekt\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\ChangeProductInSubiekt;
use App\Models\Products\Product;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdatePriceFromSubiekt //implements ShouldQueue
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
        $updatedPriceTowars = DB::connection("subiekt")->table("Belibe_System_Ceny_Updated")->get();

        foreach ($updatedPriceTowars as $updatedPriceTowar) {
            $towar = Towar::find($updatedPriceTowar->id);
            $cena = $towar->cena;

            $product = Product::findBySubiektId($updatedPriceTowar->id);
//            dd($cena, $product, $product->model->prices);
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

