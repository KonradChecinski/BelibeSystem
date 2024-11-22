<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChangeProductInSubiekt implements ShouldQueue, ShouldBeUnique
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

    public function uniqueId(): string
    {
        return $this->product->id;
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

        $subiektTowar->Symbol = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->symbol, 0, 50));
        $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->name, 0, 50));
        $subiektTowar->DoSklepuInternetowego = (bool)$this->product->show_in_b2c;
        $subiektTowar->PoleWlasne["KolorSymbol"] = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->color->shortcut, 0, 50));
        $subiektTowar->PoleWlasne["KolorNazwa"] = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->color->name, 0, 50));
//        if (!is_null($this->product->color->b2cColor)) $subiektTowar->PoleWlasne["KolorSKLEP"] = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->color->b2cColor->name, 0, 50));
        $subiektTowar->PoleWlasne["Rozmiar"] = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->size->name, 0, 50));


        $subiektTowar->KodyKreskowe->Podstawowy = "";
        for ($i = 1; $i <= $subiektTowar->KodyKreskowe->Liczba; $i++) {
            $subiektTowar->KodyKreskowe[$i]->Usun();
        }
        Log::debug($this->product->subiekt_id);
        $subiektTowar->zapisz();
        DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $this->product->subiekt_id)->delete();


        foreach ($this->product->barcodes as $id => $barcode) {
            if ($id == 0) {
                $subiektTowar->KodyKreskowe->Podstawowy = $barcode->barcode;
                continue;
            }

            $subiektTowar->KodyKreskowe->Dodaj($barcode->barcode);
        }


        $subiektTowar->zapisz();

        if ($zablokowany) {
            $subiektTowar->Aktywny = false;
            $subiektTowar->zapisz();
        }

        DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $this->product->subiekt_id)->delete();

    }
}
