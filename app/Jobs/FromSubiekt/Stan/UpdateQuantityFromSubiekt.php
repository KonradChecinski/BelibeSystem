<?php

namespace App\Jobs\FromSubiekt\Stan;

use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdateQuantityFromSubiekt implements ShouldQueue
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
        $updatedStany = DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->get();

        foreach ($updatedStany as $updatedStan) {
            $productSubiekt = Towar::find($updatedStan->id);
            $stan = $productSubiekt->stany->sum("st_Stan");
            $stanWszystkie = $productSubiekt->stanyWszystkie->sum("st_Stan");
            $product = Product::findBySubiektId($updatedStan->id);
            if (is_null($product)) {
                DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->where("id", $updatedStan->id)->delete();
                continue;
            }

            $product->update([
                "quantity" => $stan,
                "quantity_total" => $stanWszystkie,
            ]);
            $product->save();

            DB::connection("subiekt")->table("Belibe_System_Stany_Updated")->where("id", $updatedStan->id)->delete();

            ShoperChangeQuantity::dispatch($product);
        }
    }
}
