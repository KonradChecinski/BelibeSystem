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

class CreateFvFromClientOrderInSubiekt implements ShouldQueue
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

//        dd($this->subiektOrderId, $this->clientOrder);

//            $orderProducts = $order->orderProducts;
//        $warehouseDocument = $this->clientOrder->warehouseDocument;
//        $orderProducts = $this->clientOrder->warehouseDocument->warehouseDocumentProducts;
        $client = $this->clientOrder->client;
//        $delivery = $this->clientOrder->delivery;
//        $payment = $this->clientOrder->payment;
//        $location = $this->clientOrder->location;

//            dd($order, $client, $orderProducts, $payment, $location, $delivery, $warehouseDocument);

        $faktura = $subiekt->SuDokumentyManager->DodajFS();
        $faktura->NaPodstawie($this->subiektOrderId);
        $faktura->FormaDokumentu = 1;
        $faktura->StatusDokumentu = 3;
//        dd($this->warehouseDocument->user->name);
        $faktura->Wystawil = iconv("UTF-8", "Windows-1250//IGNORE", $this->warehouseDocument->user->firstname . " " . $this->warehouseDocument->user->lastname);
//        $faktura->PersonelId = 23;

        if (!is_null($client->accountManager->subiekt_category_name)) {
            $categoryName = $client->accountManager->subiekt_category_name;
            $categorySubiekt = DB::connection("subiekt")->table("sl_Kategoria")->where("kat_Nazwa", $categoryName)->first();
            if ($categorySubiekt) {
                $faktura->KategoriaId = (int)$categorySubiekt->kat_Id;
            }
        }

//        $faktura->Wyswietl();
        $faktura->Zapisz();

        if (!is_null($this->warehouseDocument->user->subiekt_id)) {
            DB::connection("subiekt")->table("dok__Dokument")->where("dok_Id", $faktura->Identyfikator)->update([
                "dok_PersonelId" => $this->warehouseDocument->user->subiekt_id,
            ]);
        }


    }
}
