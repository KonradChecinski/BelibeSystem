<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateTowarInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $product;
    public $tries = 0;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->onQueue('sfera');
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $productSubiekt = Towar::where("tw_Symbol", $this->product->symbol)->first();

        if ($productSubiekt == null) {

            $subiekt = app(Subiekt::class)->getInstance();
            $subiekt = $subiekt->connect();

            $subiektTowar = $subiekt->Towary->Dodaj(1);

            $subiektTowar->Symbol = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->symbol, 0, 30));
            $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->name, 0, 50));
            $subiektTowar->zapisz();

            $test1 = $this->product;
            $this->product->update([
                "subiekt_id" => $subiektTowar->Identyfikator,
                "show_in_subiekt" => true
            ]);
        } else {
            $this->product->update([
                "subiekt_id" => $productSubiekt->tw_Id,
                "show_in_subiekt" => true
            ]);
        }

        ChangeProductInSubiekt::dispatch($this->product);
        ChangePriceInModelInSubiekt::dispatch($this->product->model);
    }
}
