<?php

namespace App\Jobs\partners;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Models\B2bPayment;
use App\Models\Client\Client;
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

class CreateInvoiceFromPartnerSummaryFile implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;
    public $timeout = 60;

    private Partner $partner;
    private Collection $sold;
    private Client $client;
    private B2bPayment $payment;
    private int $mag_id;

    /**
     * Create a new job instance.
     */
    public function __construct(Partner $partner, Client $client, Collection $sold, B2bPayment $b2bPayment, int $mag_id)
    {
        $this->onQueue('sfera');
        $this->partner = $partner;
        $this->sold = $sold;
        $this->client = $client;
        $this->payment = $b2bPayment;
        $this->mag_id = $mag_id;
    }

    public function uniqueId(): string
    {
        return $this->partner->id . $this->client->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = $this->mag_id;

//        $client = $this->partner->client;
        $faktura = $subiekt->SuDokumentyManager->DodajFS();
        $faktura->KontrahentId = $this->client->subiekt_id;
        $faktura->LiczonyOdCenBrutto = false;
        $faktura->PoziomCenyId = 2;
        $faktura->Pozycje->PrzeliczWedlugPoziomuCen();

//        $faktura->StatusDokumentu = 3;

        foreach ($this->sold as $item) {
            $item = (object)$item;
//            dd($item);
            $product = Product::query()->where("symbol", $item->Symbol)->firstOrFail();

            $pozycja = $faktura->Pozycje->Dodaj((int)$product->subiekt_id);
//            $pozycja->CenaNettoPrzedRabatem = (float)$item->Cena; // / 100;
//            $pozycja->CenaNettoPoRabacie = (float)$item->Cena; // / 100;
            $price = $product->model->priceForClientB2b($this->client);
            $pozycja->CenaNettoPrzedRabatem = (float)$price->discounted_wholesale_net_price / 100;
            $pozycja->CenaNettoPoRabacie = (float)$price->discounted_wholesale_net_price / 100;
            $pozycja->IloscJm = (int)$item->Bilans;
        }

        $faktura->PlatnoscKredytKwota = $faktura->KwotaDoZaplaty;
        $faktura->PlatnoscKredytId = $this->payment->subiekt_id;

        $date = date("Y-m-d H:i:s");
        $faktura->PoleWlasne["Czas"] = $date;

//        $faktura->Wyswietl();
        $faktura->Zapisz();

//        $faktura->PlatnoscKredytId = $this->payment->subiekt_id;
//        $faktura->Zapisz();


        $subiekt->MagazynId = 1;
    }
}
