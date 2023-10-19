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

class DisableProductInSubiekt implements ShouldQueue
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
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();


        if (is_null($this->product->subiekt_id)) return;

        $zablokowany = (bool)Towar::find($this->product->subiekt_id)->tw_Zablokowany;
        $subiektTowar = $subiekt->Towary->Wczytaj($this->product->subiekt_id);

        if ($zablokowany) {
            $subiektTowar->Aktywny = true;
            $subiektTowar->zapisz();
        }


        $subiektTowar->Aktywny = false;
        $subiektTowar->zapisz();


    }
}
