<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductModelPriceRequest;
use App\Http\Requests\Product\UpdateProductModelPriceRequest;
use App\Jobs\Shoper\ShoperChangePrice;
use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Models\Products\Price\ProductModelPrice;

class ProductModelPriceController extends Controller
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
    public function store(StoreProductModelPriceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductModelPrice $productModelPrice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductModelPrice $productModelPrice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductModelPriceRequest $request, ProductModelPrice $productModelPrice)
    {
        $productModelPrice->update($request->all());
        ChangePriceInModelInSubiekt::dispatch($productModelPrice->model);
        ShoperChangePrice::dispatch($productModelPrice->model);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductModelPrice $productModelPrice)
    {
        //
    }
}
