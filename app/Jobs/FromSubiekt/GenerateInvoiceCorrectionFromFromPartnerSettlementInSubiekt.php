<?php

namespace App\Jobs\FromSubiekt;

use App\Models\PartnerSettlementDocument;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class GenerateInvoiceCorrectionFromFromPartnerSettlementInSubiekt implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;//5;
    public $backoff = 20;

    private PartnerSettlementDocument $partnerSettlementDocument;

    /**
     * Create a new job instance.
     */
    public function __construct(PartnerSettlementDocument $partnerSettlementDocument)
    {
        $this->onQueue('sfera');
        $this->partnerSettlementDocument = $partnerSettlementDocument;
    }

    public function uniqueId()
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
        if ($this->partnerSettlementDocument->type !== 2) {
            throw new RuntimeException("Nieprawidłowy typ dokumentu rozliczeniowego");
        }


        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = $this->partnerSettlementDocument->settlement->partner->warehouse_id;


        $client = $this->partnerSettlementDocument->settlement->partner->client;
        $partnerSettlementDocument = $this->partnerSettlementDocument;

        $subiektInvoice = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->where("dok_Id", $partnerSettlementDocument->document_subiekt_id)
            ->whereIn("dok_Typ", [6])
            ->where("dok_Podtyp", 0)
            ->first([
                "dok_Id",
                "dok_NrPelny",
                "dok_Status",
                "dok_WartNetto",
                "dok_WartBrutto",
                "dok_DataWyst"
            ]);
        if (!$subiektInvoice) {
            throw new RuntimeException("Nie znaleziono faktury w Subiekcie");
        }

        $invoiceCorrection = $subiekt->SuDokumentyManager->Wczytaj($subiektInvoice->dok_NrPelny);
//        dd($subiektInvoice, $invoice->NumerPelny, $invoice->WartoscBrutto, $invoice->DataWystawienia);

        $uuid = Str::uuid();
        $path = storage_path("app/temp/{$uuid}.pdf");
        $invoiceCorrection->DrukujDoPlikuWgWzorca(567, $path, 0); //Tymczasowo zapisane w temp

        $invoiceCorrectionPath = Storage::putFile("invoices", $path);

        unlink($path);  //usuwanie pliku z temp

        if ($this->partnerSettlementDocument->clientInvoice()->count() > 0) $this->partnerSettlementDocument->clientInvoice()->delete();
        $invoice = $this->partnerSettlementDocument->clientInvoice()->create([
            'client_id' => $client->id,
            'type' => 2,
            'number' => $subiektInvoice->dok_NrPelny,
            'net_value' => $subiektInvoice->dok_WartNetto * 100,
            'gross_value' => $subiektInvoice->dok_WartBrutto * 100,
            'datetime' => $subiektInvoice->dok_DataWyst,
            'path' => $invoiceCorrectionPath,
        ]);

        $subiekt->MagazynId = 1;

//        $order->client->notify(new InvoiceGeneratedClient($order));

//        wyrazenie.DrukujDoPlikuWgWzorca(lWzorzec, bstrPlik, 0)

        //Faktury
        //wzw_Id	wzw_Typ	wzw_Zrodlo	wzw_Nazwa
        //1000023	101	3	FS grupowanie 6
        //1000030	101	3	FS grupowanie 11 - konto walutowe
        //1000041	101	3	FS grupowanie 11
        //1000057	101	3	FS grupowanie 11 - bez dok. powiązanego
        //1000071	101	3	FS grupowanie 11 - duplikat
        //1000072	101	2	FS zwykła - konto walutowe - angielski
        //1000073	101	2	FS zwykła - konto walutowe - niemiecki
        //1000074	101	2	FS zwykła - duplikat
        //1000076	101	2	FS zwykła - konto walutowe - polski
        //1000078	101	3	FS grupowanie symbol
        //1000086	101	2	FS zwykła

        //Korekty
        //wzw_Id	wzw_Typ	wzw_Zrodlo	wzw_Nazwa
        //561	107	1	KFS standard
        //562	107	1	KFS rozbicie na dostawy
        //565	107	1	KFS duplikat
        //566	107	1	KFS przedpłaty
        //567	107	1	KFS tylko korygowane pozycje
        //646	107	1	KFS odwrotne obciążenie
        //684	107	1	KFS akcyza
    }
}
