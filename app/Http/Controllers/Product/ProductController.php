<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductModelRequest;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductUnit;
use App\Models\SettingsDictionarySize;

class ProductController extends Controller
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
    public function store(StoreProductRequest $request, ProductModelColor $modelColor)
    {
        $size = SettingsDictionarySize::find($request->size['id']);
        $unit = ProductUnit::find($request->unit['id']);

        $product = new Product($request->all());
        $product->size()->associate($size);
        $product->unit()->associate($unit);

        $product2 = $modelColor->products()->save($product);

        foreach ($request->barcodes as $id => $barcodeValue) {
            $barcode = new ProductBarcode($barcodeValue);
            $barcode->main = $id == 0;
            $barcode->product()->associate($product2);
            $barcode->save();
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        if ($request->size['id'] !== $product->size->id) $product->size()->associate($request->size['id']);
        if ($request->unit['id'] !== $product->unit->id) $product->unit()->associate($request->unit['id']);


        $product->save();
//        dd($request, $product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductRequest $request, Product $product)
    {
        $deleteColorModel = $product->color->products()->count() == 1 ? true : false;

        $product->delete();

        if ($deleteColorModel) $product->color->delete();
    }
}
