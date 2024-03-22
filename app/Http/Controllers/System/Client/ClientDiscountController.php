<?php

namespace App\Http\Controllers\System\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientDiscountRequest;
use App\Http\Requests\Client\UpdateClientDiscountRequest;
use App\Models\Client\Client;
use App\Models\ClientDiscount;

class ClientDiscountController extends Controller
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
    public function store(StoreClientDiscountRequest $request, Client $client)
    {
        $clientDiscount = new ClientDiscount([
            "type" => $request->type["id"],
            "value" => $request->value,
        ]);
        $clientDiscount->client()->associate($client);
        if (!is_null($request->product_model)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_model_id", $request->product_model["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrany produkt już ma rabat'
                ]);
            }
            $clientDiscount->productModel()->associate($request->product_model["id"]);
        } else if (!is_null($request->product_category)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_category_id", $request->product_category["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana kategoria już ma rabat'
                ]);
            }
            $clientDiscount->productCategory()->associate($request->product_category["id"]);
        } else if (!is_null($request->product_group)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_group_id", $request->product_group["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana grupa już ma rabat'
                ]);
            }
            $clientDiscount->productGroup()->associate($request->product_group["id"]);
        } else if (!is_null($request->product_brand)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_brand_id", $request->product_brand["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana marka już ma rabat'
                ]);
            }
            $clientDiscount->productBrand()->associate($request->product_brand["id"]);
        } else {
            abort(403);
        }
//        dd($request->all(), $clientDiscount);

        $clientDiscount->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientDiscount $clientDiscount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientDiscount $clientDiscount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientDiscountRequest $request, Client $client, ClientDiscount $clientDiscount)
    {
        if ($clientDiscount->client != $client) abort(403);

        $clientDiscount->type = $request->type["id"];
        $clientDiscount->value = $request->value;

        $clientDiscount->productModel()->dissociate();
        $clientDiscount->productCategory()->dissociate();
        $clientDiscount->productGroup()->dissociate();
        $clientDiscount->productBrand()->dissociate();

        if (!is_null($request->product_model)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_model_id", $request->product_model["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrany produkt już ma rabat'
                ]);
            }
            $clientDiscount->productModel()->associate($request->product_model["id"]);
        } else if (!is_null($request->product_category)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_category_id", $request->product_category["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana kategoria już ma rabat'
                ]);
            }
            $clientDiscount->productCategory()->associate($request->product_category["id"]);
        } else if (!is_null($request->product_group)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_group_id", $request->product_group["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana grupa już ma rabat'
                ]);
            }
            $clientDiscount->productGroup()->associate($request->product_group["id"]);
        } else if (!is_null($request->product_brand)) {
            $count = ClientDiscount::query()
                ->where("type", 1)
                ->where("product_brand_id", $request->product_brand["id"])
                ->where("client_id", $client->id)
                ->count();
            if ($count > 0) {
                return redirect()->back()->withErrors([
                    'name' => 'Wybrana marka już ma rabat'
                ]);
            }
            $clientDiscount->productBrand()->associate($request->product_brand["id"]);
        } else {
            abort(403);
        }

        $clientDiscount->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client, ClientDiscount $clientDiscount)
    {
        if ($clientDiscount->client != $client) abort(403);

        $clientDiscount->delete();
    }
}
