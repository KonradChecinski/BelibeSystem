<?php

namespace App\Jobs\partners;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Jobs\FromSubiekt\GenerateInvoiceFromFromPartnerSettlementInSubiekt;
use App\Models\B2bPayment;
use App\Models\Client\Client;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Models\PartnerSettlementDocument;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Singleton\Subiekt;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use RuntimeException;

class CreateInvoiceFromPartnerSettlement implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;
    public $timeout = 60;

    private PartnerSettlementDocument $partnerSettlementDocument;
    private Partner $partner;

    /**
     * Create a new job instance.
     */
    public function __construct(PartnerSettlementDocument $partnerSettlementDocument)
    {
        $this->onQueue('sfera');
        $this->partnerSettlementDocument = $partnerSettlementDocument;
    }

    public function uniqueId(): string
    {
        return $this->partnerSettlementDocument->id;
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(): void
    {
        if ($this->partnerSettlementDocument->settlement->partner->client->subiekt_id === null) {
            throw new RuntimeException("Klient nie ma przypisanego ID w Subiekcie");
        }

        if ($this->partnerSettlementDocument->settlement->partner->warehouse_id === null) {
            throw new RuntimeException("Klient nie ma przypisanego magazynu w Subiekcie");
        }

        if ($this->partnerSettlementDocument->settlement->partner->b2bPayment === null) {
            throw new RuntimeException("Klient nie ma przypisanej formy płatności w Subiekcie");
        }


        if ($this->partnerSettlementDocument->status !== 1) {
            GenerateInvoiceFromFromPartnerSettlementInSubiekt::dispatch($this->partnerSettlementDocument);
            throw new RuntimeException("Dokument nie jest w statusie do wystawienia faktury");
        }

        if ($this->partnerSettlementDocument->type !== 1) {
            throw new RuntimeException("Dokument nie jest typu faktura");
        }


        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $this->partner = $this->partnerSettlementDocument->settlement->partner;

        $subiekt->MagazynId = $this->partner->warehouse_id;

//        $client = $this->partner->client;
        $faktura = $subiekt->SuDokumentyManager->DodajFS();
        $faktura->KontrahentId = $this->partner->client->subiekt_id;
        $faktura->LiczonyOdCenBrutto = false;
        $faktura->PoziomCenyId = 2;
        $faktura->Pozycje->PrzeliczWedlugPoziomuCen();

        $faktura->DataWystawienia = $this->partnerSettlementDocument->settlement->settlement_date;
        $faktura->DataZakonczeniaDostawy = $this->partnerSettlementDocument->settlement->settlement_date;

        $faktura->StatusDokumentu = 3;
//        dd($this->partner->b2bPayment);
        foreach ($this->partnerSettlementDocument->items as $item) {
//            dd($item, $item->product);

            $pozycja = $faktura->Pozycje->Dodaj((int)$item->product->subiekt_id);
//            $pozycja->CenaNettoPrzedRabatem = (float)$item->Cena; // / 100;
//            $pozycja->CenaNettoPoRabacie = (float)$item->Cena; // / 100;
            $pozycja->CenaNettoPrzedRabatem = (float)$item->price_net_final / 100;
            $pozycja->CenaNettoPoRabacie = (float)$item->price_net_final / 100;
            $pozycja->IloscJm = (int)$item->quantity;
        }

        $faktura->PlatnoscKredytKwota = $faktura->KwotaDoZaplaty;
        $faktura->PlatnoscKredytId = $this->partner->b2bPayment->subiekt_id;

        $date = date("Y-m-d H:i:s");
        $faktura->PoleWlasne["Czas"] = $date;

//        $faktura->Wyswietl();
        $faktura->Zapisz();

//        $faktura->PlatnoscKredytId = $this->payment->subiekt_id;
//        $faktura->Zapisz();

        $this->partnerSettlementDocument->update([
            "status" => 2,
            "document_subiekt_id" => $faktura->Identyfikator,
            "document_name" => $faktura->NumerPelny
        ]);


        $subiekt->MagazynId = 1;

        GenerateInvoiceFromFromPartnerSettlementInSubiekt::dispatch($this->partnerSettlementDocument);
    }
}
