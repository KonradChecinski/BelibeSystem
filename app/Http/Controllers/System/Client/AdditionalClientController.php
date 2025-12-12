<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\UpdateAdditionalClientRequest;
use App\Models\Client\Client;
use Illuminate\Http\Request;

class AdditionalClientController extends Controller
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
    public function update(UpdateAdditionalClientRequest $request, Client $client)
    {
        $client->update([
            "priority" => $request->priority,
            "blacklist" => $request->blacklist,
            "newsletter" => $request->newsletter,
            "settlements_mail" => $request->settlements_mail,
        ]);
        $client->status()->associate($request->status["id"]);
        $client->sourceOfAcquisition()->associate($request->source_of_acquisition["id"]);
        $client->industry()->associate($request->industry["id"]);
        $client->payments()->sync(collect($request->payments)->map(function ($payment) {
            return $payment["id"];
        }));
        $client->status()->associate($request->status["id"]);
        $client->accountManager()->associate($request->account_manager["id"]);
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
}
