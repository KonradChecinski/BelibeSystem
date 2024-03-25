<?php

namespace App\Http\Controllers\B2B;

use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bProductController extends Controller
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
    public function show(string $slug)
    {
        $productModel = ProductModel::findBySlug($slug);
//        $productModel = $productModel->load(['prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency']);
        $client = Client::find(auth()->user()->client_id);


        //        dd($productModel);
        return Inertia::render('B2B/Model',
            [
                "model" => [
                    'id' => $productModel->id,
                    'name' => $productModel->name,
                    'symbol' => $productModel->symbol,
                    'slug' => $productModel->slug,
                    'mainImages' => $productModel->mainImages() ? $productModel->mainImages()->map(fn($image) => ["path" => $image->path]) : null,
                    'price' => array_merge($productModel->prices->toArray(), $productModel->priceForClientB2b($client)),
                    'quantity' => $productModel->quantityToB2b(),
                ]
            ]
        );
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
