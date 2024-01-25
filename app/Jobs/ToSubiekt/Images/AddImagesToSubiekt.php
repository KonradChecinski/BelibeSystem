<?php

namespace App\Jobs\ToSubiekt\Images;

use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use App\Singleton\SubiektDodatki;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Nette\Utils\Image;

class AddImagesToSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected ProductModelColor $productModelColor;
    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModelColor $productModelColor)
    {
        $this->onQueue('sfera');
        $this->productModelColor = $productModelColor;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

//        dd($this->productModel);

        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();
        $subiektDodatki = app(SubiektDodatki::class)->getInstance();
        $subiektDodatki = $subiektDodatki->create();

        $products = $this->productModelColor->products;


        foreach ($products as $product) {
            if (is_null($product->subiekt_id)) continue;

            $zablokowany = (bool)Towar::find($product->subiekt_id)->tw_Zablokowany;
            $subiektTowar = $subiekt->Towary->Wczytaj($product->subiekt_id);

            if ($zablokowany) {
                $subiektTowar->Aktywny = true;
                $subiektTowar->zapisz();
            }


            for ($i = $subiektTowar->Zdjecia->Liczba; $i >= 1; $i--) {
                $image = $subiektTowar->Zdjecia[$i];
                $image->usun();
            }
            $subiektTowar->zapisz();

            foreach ($product->color->images->sortBy("order")->values() as $id => $image) {
                if ($id > 1) continue;

                Storage::disk("local")->put("temp/temp", Storage::get('images/' . str_replace('\\', '/', $image->path)));
                $imageSubiekt = $subiektTowar->Zdjecia->Dodaj(Storage::disk("local")->path("temp/temp"));
                $imageSubiekt->Glowne = (bool)$id == 0;
            }

            $subiektTowar->zapisz();

            if ($zablokowany) {
                $subiektTowar->Aktywny = false;
                $subiektTowar->zapisz();
            }

            DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $product->subiekt_id1)->delete();
            DB::connection("subiekt")->table("Belibe_System_Zdjecia_Zmienione")->truncate();

        }
    }
}
