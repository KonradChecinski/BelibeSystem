<?php

namespace App\Jobs;

use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductShowInSubiekt;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use DragonCode\Support\Helpers\Boolean;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateSubiektIdWhereNull implements ShouldQueue
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
        $products = Product::where("subiekt_id", "=", null)->get();
        foreach ($products as $product) {
            $subiektTowar = Towar::where("tw_Symbol", $product->symbol)->first();
            if ($subiektTowar == null) continue;
            $product->update([
                "subiekt_id" => $subiektTowar->tw_Id,
                "show_in_subiekt" => !(bool)$subiektTowar->Zablokowany
            ]);
            ChangeProductInSubiekt::dispatch($product);
            ChangeProductShowInSubiekt::dispatch($product);
            ChangePriceInModelInSubiekt::dispatch($product->model);
        }

    }
}
