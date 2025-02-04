<?php

namespace App\Jobs\partners;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class CreateFvFromPartnerSummaryFile implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;
    public $timeout = 60;

    private Partner $partner;
    private Collection $sold;

    /**
     * Create a new job instance.
     */
    public function __construct(Partner $partner, Collection $sold)
    {
        $this->onQueue('sfera');
        $this->partner = $partner;
        $this->sold = $sold;
    }

//    public function uniqueId(): string
//    {
//        return $this->warehouseId . $this->clientId . $this->from->toDateString() . $this->to->toDateString();
//    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = 46;

//        $client = $this->partner->client;
        $faktura = $subiekt->SuDokumentyManager->DodajFS();
//        $faktura->KontrahentId = $client->subiekt_id;
//        $faktura->NumerOryginalny = mb_substr(Str::ascii($order->number), 0, 30);
        $faktura->LiczonyOdCenBrutto = false;
        $faktura->PoziomCenyId = 2;
        $faktura->Pozycje->PrzeliczWedlugPoziomuCen();

        $faktura->StatusDokumentu = 3;

        foreach ($this->sold as $item) {
            $item = (object)$item;
//            dd($item);
            $product = Product::query()->where("symbol", $item->Symbol)->firstOrFail();

            $pozycja = $faktura->Pozycje->Dodaj((int)$product->subiekt_id);
            $pozycja->CenaNettoPrzedRabatem = (float)$item->Cena; // / 100;
            $pozycja->CenaNettoPoRabacie = (float)$item->Cena; // / 100;
            $pozycja->IloscJm = (int)$item->Bilans;
        }

        $faktura->PlatnoscKredytKwota = $faktura->KwotaDoZaplaty;
        $faktura->PlatnoscKredytId = 11;//$payment->subiekt_id;
        $faktura->Rozliczony = false;

        $date = date("Y-m-d H:i:s");
        $faktura->PoleWlasne["Czas"] = $date;

        $faktura->Wyswietl();
//        $faktura->Zapisz();

//        $faktura->PlatnoscKredytId = 11;//$payment->subiekt_id;
//        $faktura->Rozliczony = false;
//        $faktura->Zapisz();
        $subiekt->MagazynId = 1;
    }
}
