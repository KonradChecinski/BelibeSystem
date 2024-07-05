<?php

namespace App\Jobs\FromSubiekt\Finanse;

use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateSettlementsFromSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $updatedSettlements = DB::connection("subiekt")->table("Belibe_System_Finanse_Created")->get();

//        dd($updatedSettlements);
        foreach ($updatedSettlements as $updatedSettlement) {
            $subiektSettlement = null;
            if ((int)$updatedSettlement->type === 1) {
                $subiektSettlement = SubiektReceivable::find($updatedSettlement->id);
            }

            if ((int)$updatedSettlement->type === 2) {
                $subiektSettlement = SubiektObligation::find($updatedSettlement->id);
            }

            if (is_null($subiektSettlement)) continue;

            $client = $subiektSettlement->client;

            if (is_null($client)) {
                DB::connection("subiekt")->table("Belibe_System_Finanse_Created")->where("id", $updatedSettlement->id)->delete();
                continue;
            }

            $invoice = ClientInvoice::query()->where("number", $subiektSettlement->nzf_NumerPelny)->first();

            $settlement = new ClientSettlement([
                "document_id" => $invoice->id ?? null,
                "subiekt_id" => $subiektSettlement->nzf_Id,
                "type" => $updatedSettlement->type,

                "number" => $subiektSettlement->nzf_NumerPelny,
                "settlement" => $subiektSettlement->Rozliczenie,
                "datetime" => $subiektSettlement->nzf_Data,
                "date_of_payment" => $subiektSettlement->nzf_TerminPlatnosci,
                "date_of_last_payment" => $subiektSettlement->nzf_DataOstatniejSplaty,
                "original_value" => $subiektSettlement->WartoscPierwotna * 100,
                "value" => $subiektSettlement->Wartosc * 100,
            ]);

            $settlement->client()->associate($client);
            $settlement->save();
//            dd($subiektSettlement, $client, $settlement);

            DB::connection("subiekt")->table("Belibe_System_Finanse_Created")->where("id", $updatedSettlement->id)->delete();
        }
    }
}
