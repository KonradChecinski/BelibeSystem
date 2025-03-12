<?php

namespace App\Http\Controllers\System\Client;

use App\Helpers\Subiekt\SubiektQueries;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\UpdateBasicClientRequest;
use App\Http\Requests\Client\UpdateBasicGUSClientRequest;
use App\Http\Requests\Client\UpdateBasicSubiektClientRequest;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Http\Request;

class BasicClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBasicClientRequest $request, Client $client)
    {
        $client->update($request->except(["nip"]));
        $client->country()->associate($request->country["id"]);
        $client->save();
//        ChangeBasicInModelInSubiekt::dispatch($productModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateFromGUS(UpdateBasicGUSClientRequest $request, Client $client)
    {
        $client->update($request->validated());
        $client->save();
    }

    public function connectToSubiekt(UpdateBasicSubiektClientRequest $request, Client $client)
    {
//        dd("connectToSubiekt", $client->nip);
        $subiektId = SubiektQueries::getClientIdByNip($client->nip);
        if (is_null($subiektId)) {
            return redirect()->back()->withErrors("Nie znaleziono klienta w Subiekcie");
        }

        $client->subiekt_id = $subiektId;
        $client->save();

        if ($client->receivables()->count() > 0 || $client->obligations()->count() > 0) {
            return redirect()->back()->withErrors("Powiązano z Subiektem, jednak klient ma już rozliczenia");
        } else {
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
        }


    }
}
