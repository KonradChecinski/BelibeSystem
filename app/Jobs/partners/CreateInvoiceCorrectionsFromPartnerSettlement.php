<?php

namespace App\Jobs\partners;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Helpers\Subiekt\SubiektQueries;
use App\Jobs\FromSubiekt\GenerateInvoiceCorrectionFromFromPartnerSettlementInSubiekt;
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
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use RuntimeException;

class CreateInvoiceCorrectionsFromPartnerSettlement implements ShouldQueue, ShouldBeUnique
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
            GenerateInvoiceCorrectionFromFromPartnerSettlementInSubiekt::dispatch($this->partnerSettlementDocument);
            throw new RuntimeException("Dokument nie jest w statusie do wystawienia faktury");
        }

        if ($this->partnerSettlementDocument->type !== 2) {
            throw new RuntimeException("Dokument nie jest typu faktura");
        }

        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $this->partner = $this->partnerSettlementDocument->settlement->partner;

        $subiekt->MagazynId = $this->partner->warehouse_id;

//        dd($this->partnerSettlementDocument);


        $kfs = $subiekt->SuDokumentyManager->DodajKFS();
        $kfs->NaPodstawie($this->partnerSettlementDocument->to_document_subiekt_id);
        $kfs->DataWystawienia = $this->partnerSettlementDocument->settlement->settlement_date;

        foreach ($this->partnerSettlementDocument->items as $item) {
            $pozycja = $kfs->Pozycje->Element($item->document_position);
            $pozycja->IloscJmPoKorekcie = (int)((int)$pozycja->IloscJm - $item->quantity);
            $pozycja->PrzyczynaKorektyId = 7;

            //pkr_Id	pkr_Nazwa
            //1	Pomyłka w cenie
            //2	Pomyłka w ilości sprzedanej
            //3	Pomyłka w stawce podatku
            //4	Uszkodzony towar
            //5	Reklamacja
            //6	Przyznanie rabatu za przekroczenie progu obrotu
            //7	zwrot towaru
        }


        $kfs->PlatnoscKredytKwota = $kfs->KwotaDoZaplaty;
        $kfs->PlatnoscKredytId = 17;

        $date = date("Y-m-d H:i:s");
        $kfs->PoleWlasne["Czas"] = $date;

//            $kfs->Wyswietl();
        $kfs->Zapisz();

//            $kfs->PlatnoscKredytId = 17;
//            $kfs->Zapisz();


        $this->partnerSettlementDocument->update([
            "status" => 2,
            "document_subiekt_id" => $kfs->Identyfikator,
            "document_name" => $kfs->NumerPelny
        ]);


        $subiekt->MagazynId = 1;

        GenerateInvoiceCorrectionFromFromPartnerSettlementInSubiekt::dispatch($this->partnerSettlementDocument);
    }
}
