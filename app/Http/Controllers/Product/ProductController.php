<?php

namespace App\Http\Controllers\Product;

use App\Helpers\Barcodes\BarcodeInside;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Jobs\ToSubiekt\ChangeProductInSubiekt;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductSize;
use App\Models\Products\ProductUnit;

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
        $size = ProductSize::find($request->size['id']);
        $unit = ProductUnit::find($request->unit['id']);

        $product = new Product($request->all());
        $product->size()->associate($size);
        $product->unit()->associate($unit);

        $product2 = $modelColor->products()->save($product);

        if (collect($request->barcodes)->where("type", 2)->count() > 1) response("Nie można wygenerować nowego kodu wewnętrznego", 503);


        foreach ($request->barcodes as $id => $barcodeValue) {
            if ($barcodeValue["type"] == 2 && strlen($barcodeValue["barcode"]) !== 13) {
                $barcode = BarcodeInside::generate();
                if ($barcode == null) response("Nie można wygenerować nowego kodu wewnętrznego", 503);
            } else {
                $barcode = new ProductBarcode($barcodeValue);
            }
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
        if ($request->color['id'] !== $product->color->id) $product->color()->associate($request->color['id']);

        if (collect($request->barcodes)->where("type", 2)->count() > 1) response("Nie można wygenerować nowego kodu wewnętrznego", 503);


        $barcodes = [];
        foreach ($request->barcodes as $id => $barcodeValue) {

            if ($barcodeValue["type"] == 2 && strlen($barcodeValue["barcode"]) !== 13) {
                $barcode = BarcodeInside::generate();
                if ($barcode == null) response("Nie można wygenerować nowego kodu wewnętrznego", 503);
            } else {
                $barcode = new ProductBarcode($barcodeValue);
            }
            $barcode->main = $id == 0;
            array_push($barcodes, $barcode);
        }

        $product->barcodes()->delete();
        $product->barcodes()->saveMany($barcodes);


        $product->symbol = $request->symbol;
        $product->name = $request->name;

        $product->save();

        ChangeProductInSubiekt::dispatch($product);
//        dd($request, $product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductRequest $request, Product $product)
    {
        $deleteColorModel = $product->color->products()->count() == 1 ? true : false;
        $deleteModel = $product->model->colors->count() == 1 ? true : false;

        $product->barcodes()->delete();
        $product->delete();

        if ($deleteColorModel) {
            $product->color->delete();
            if ($deleteModel) {
                $product->model->prices()->delete();
                $product->model->delete();
                return redirect()->route('system.products.models');
            }
        }
    }
}
