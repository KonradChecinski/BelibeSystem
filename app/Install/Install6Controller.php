<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Support\Facades\DB;


class Install6Controller extends Controller
{
    public function install()
    {
        foreach (Client::all() as $client) {
            if (is_null($client->subiekt_id)) {
                continue;
            }


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
//                dd($settlement);
//                break;
            }


//            dd($receivables->toArray(), $obligations->toArray());
        }


        return ("OK");
    }
}
