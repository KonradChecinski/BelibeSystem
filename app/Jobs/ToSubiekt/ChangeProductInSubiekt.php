<?php

namespace App\Jobs\ToSubiekt;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ChangeProductInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $product;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
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

        $subiektTowar->Symbol = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->symbol, 0, 50));
        $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->name, 0, 50));
        $subiektTowar->DoSklepuInternetowego = $this->product->show_in_b2c;
//        $subiektTowar->PoleWlasne["Kolor"] = $this->product->color->shortcut;
//        $subiektTowar->PoleWlasne["Rozmiar"] = $this->product->size->name;
//        Jednostka

        $subiektTowar->KodyKreskowe->Podstawowy = "";
        for ($i = 1; $i <= $subiektTowar->KodyKreskowe->Liczba; $i++) {
            $subiektTowar->KodyKreskowe[$i]->Usun();
        }
        $subiektTowar->zapisz();

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


    }
}
