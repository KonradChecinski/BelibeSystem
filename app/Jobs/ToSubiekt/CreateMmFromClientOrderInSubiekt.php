<?php

namespace App\Jobs\ToSubiekt;

use App\Models\ClientOrder;
use App\Models\WarehouseDocument;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateMmFromClientOrderInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
//    public $backoff = 20;
    public $backoff = 2;

    public int $subiektOrderId;
    public ClientOrder $clientOrder;
    public WarehouseDocument $warehouseDocument;

    /**
     * Create a new job instance.
     */
    public function __construct(int $subiektOrderId, WarehouseDocument $warehouseDocument, ClientOrder $clientOrder)
    {
        $this->onQueue('sfera');
        $this->subiektOrderId = $subiektOrderId;
        $this->clientOrder = $clientOrder;
        $this->warehouseDocument = $warehouseDocument;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $client = $this->clientOrder->client;


        $MM = $subiekt->SuDokumentyManager->DodajMM();
        $MM->NaPodstawie($this->subiektOrderId);
        $MM->StatusDokumentu = 3;
        $MM->MagazynOdbiorczyId = $client->partner->warehouse_id;
        $MM->Wystawil = iconv("UTF-8", "Windows-1250//IGNORE", $this->warehouseDocument->user->firstname . " " . $this->warehouseDocument->user->lastname);


//        $MM->Wyswietl();
        $MM->Zapisz();

        if (!is_null($this->warehouseDocument->user->subiekt_id)) {
            DB::connection("subiekt")->table("dok__Dokument")->where("dok_Id", $MM->Identyfikator)->update([
                "dok_PersonelId" => $this->warehouseDocument->user->subiekt_id,
            ]);
        }


    }
}
