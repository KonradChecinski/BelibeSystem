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
use Illuminate\Support\Facades\DB;

class ChangeProductShowInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Product $product;
    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productId)
    {
        $this->onQueue('sfera');
        $this->product = Product::find($productId);
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


        $subiektTowar->Aktywny = $this->product->show_in_subiekt;
        $subiektTowar->DoSklepuInternetowego = $this->product->show_in_b2c;
        $subiektTowar->zapisz();


        if ($zablokowany && !$this->product->show_in_subiekt) {
            $subiektTowar->Aktywny = false;
            $subiektTowar->zapisz();
        }
        DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $this->product->subiekt_id)->delete();


    }
}
