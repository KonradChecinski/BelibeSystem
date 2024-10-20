<?php

namespace App\Console\Commands;

use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Products\Product;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Console\Command;

class AddClientSettlements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-client-settlements';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add client settlements to database from Subiekt';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->ask('Id?', null);
        if (is_null($id)) {
            $this->error("Id is required");
            return self::FAILURE;
        }

        $client = Client::find($id);
//        dd($client, $client->receivables()->count(), $client->obligations()->count());
        if (is_null($client)) {
            $this->error("Client not found");
            return self::FAILURE;
        }


        if (is_null($client->subiekt_id)) {
            $this->error("Client has no subiekt_id");
            return self::FAILURE;
        }

        if ($client->receivables()->count() > 0 || $client->obligations()->count() > 0) {
            $this->error("Client already has settlements");
            return self::FAILURE;
        }

//        dd("cos");
        $receivables = SubiektReceivable::query()->where("nzf_IdObiektu", $client->subiekt_id)->orderBy("nzf_Data")->get();

        foreach ($receivables as $receivable) {
            $invoice = ClientInvoice::query()->where("number", $receivable->nzf_NumerPelny)->first();

            $settlement = ClientSettlement::create([
                "client_id" => $client->id,
                "document_id" => $invoice->id ?? null,
                "subiekt_id" => $receivable->nzf_Id,
                "type" => 1,
                "number" => $receivable->nzf_NumerPelny,
                "settlement" => $receivable->Rozliczenie,
                "datetime" => $receivable->nzf_Data,
                "date_of_payment" => $receivable->nzf_TerminPlatnosci,
                "date_of_last_payment" => $receivable->nzf_DataOstatniejSplaty,
                "days_of_delay" => $receivable->DniSpoznienia,
                "original_value" => $receivable->WartoscPierwotna * 100,
                "value" => $receivable->Wartosc * 100,
            ]);
//                dd($settlement);
//                break;
        }

        $obligations = SubiektObligation::query()->where("nzf_IdObiektu", $client->subiekt_id)->orderBy("nzf_Data")->get();

        foreach ($obligations as $obligation) {
            $invoice = ClientInvoice::query()->where("number", $obligation->nzf_NumerPelny)->first();

            $settlement = ClientSettlement::create([
                "client_id" => $client->id,
                "document_id" => $invoice->id ?? null,
                "subiekt_id" => $obligation->nzf_Id,
                "type" => 2,
                "number" => $obligation->nzf_NumerPelny,
                "settlement" => $obligation->Rozliczenie,
                "datetime" => $obligation->nzf_Data,
                "date_of_payment" => $obligation->nzf_TerminPlatnosci,
                "date_of_last_payment" => $obligation->nzf_DataOstatniejSplaty,
//                    "days_of_delay" => $obligation->DniSpoznienia,
                "original_value" => $obligation->WartoscPierwotna * 100,
                "value" => $obligation->Wartosc * 100,
            ]);

        }


        return self::SUCCESS;

    }
}
