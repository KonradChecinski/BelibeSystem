<?php

namespace App\Http\Controllers\System\Product;

use App\Helpers\Barcodes\BarcodeGS1;
use App\Helpers\Barcodes\BarcodeInside;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\CreateTowarInSubiekt;
use App\Jobs\ToSubiekt\Towar\DisableProductInSubiekt;
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

        $modelColor->products()->save($product);

        if (collect($request->barcodes)->where("type", 1)->count() > 1) return response("Nie można wygenerować nowego kodu GS1", 503);
        if (collect($request->barcodes)->where("type", 2)->count() > 1) return response("Nie można wygenerować nowego kodu wewnętrznego", 503);


        foreach ($request->barcodes as $id => $barcodeValue) {
            if ($barcodeValue["type"] == 2 && strlen($barcodeValue["barcode"]) !== 13) {

                $barcode = BarcodeInside::generate();
                if ($barcode == null) return redirect()->back()->withErrors([
                    'barcodes' => 'Nie można wygenerować nowego kodu wewnętrznego'
                ]);
            } else if ($barcodeValue["type"] == 1 && strlen($barcodeValue["barcode"]) !== 13) {
                $barcode = BarcodeGS1::generate();
                if ($barcode == null) return redirect()->back()->withErrors([
                    'barcodes' => 'Nie można wygenerować nowego kodu GS1'
                ]);
                $isGS1BarcodeGenerated = true;
                $gs1BarcodeGenerated = $barcode;
            } else {
                $barcode = new ProductBarcode($barcodeValue);
            }
            $barcode->main = $id == 0;
            $barcode->product()->associate($product);
            $barcode->save();
        }

        CreateTowarInSubiekt::dispatch($product);
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
        if ($request->color['id'] !== $product->color->id) {
            $deleteColorModel = $product->color->products()->count() == 1 ? true : false;
            $productColor = $product->color;
            $product->color()->associate($request->color['id']);
            $product->save();

            if ($deleteColorModel) {
                $productColor->colorIcon()->dissociate();
                $productColor->save();
                $productColor->images()->delete();
                $productColor->delete();
            }
        }


        if (collect($request->barcodes)->where("type", 1)->count() > 1) return response("Nie można wygenerować nowego kodu GS1", 503);
        if (collect($request->barcodes)->where("type", 2)->count() > 1) return response("Nie można wygenerować nowego kodu wewnętrznego", 503);


        $barcodes = [];
        $isGS1BarcodeGenerated = false;
        $gs1BarcodeGenerated = "";
        foreach ($request->barcodes as $id => $barcodeValue) {

            if ($barcodeValue["type"] == 2 && strlen($barcodeValue["barcode"]) !== 13) {
                $barcode = BarcodeInside::generate();
                if ($barcode == null) return redirect()->back()->withErrors([
                    'barcodes' => 'Nie można wygenerować nowego kodu wewnętrznego'
                ]);
            } else if ($barcodeValue["type"] == 1 && strlen($barcodeValue["barcode"]) !== 13) {
                $barcode = BarcodeGS1::generate();
                if ($barcode == null) return redirect()->back()->withErrors([
                    'barcodes' => 'Nie można wygenerować nowego kodu GS1'
                ]);
                $isGS1BarcodeGenerated = true;
                $gs1BarcodeGenerated = $barcode;
            } else {
                $barcode = new ProductBarcode($barcodeValue);
            }
            $barcode->main = $id == 0;
            array_push($barcodes, $barcode);
        }


        $product->barcodes()->delete();
        $product->barcodes()->saveMany($barcodes);

        if ($isGS1BarcodeGenerated) {
            $barcodeResult = BarcodeGS1::save($gs1BarcodeGenerated, $product->model, $product);
            if ($barcodeResult == false) {
                $tmpBarcodes = collect($barcodes);
                $tmpBarcodes = $tmpBarcodes->filter(function ($barcode) {
                    return $barcode->type !== 1;
                });
                $tmpBarcodes = $tmpBarcodes->map(function ($item, $key) {
                    return new ProductBarcode([
                        "barcode" => $item->barcode,
                        "main" => $item->main,
                        "type" => $item->type,
                    ]);
                });

                $product->barcodes()->delete();
                $product->barcodes()->saveMany($tmpBarcodes);

                return redirect()->back()->withErrors([
                    'barcodes' => 'Nie można zapisać kodu kreskowego w systemie GS1. Zgłoś to Opiekunowi systemu'
                ]);
            }
        }


        $product->symbol = $request->symbol;
        $product->name = $request->name;
        $product->name_b2c = $request->name_b2c ?? '';

        $product->save();

        ChangeProductInSubiekt::dispatch($product->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductRequest $request, Product $product)
    {
        $deleteColorModel = $product->color->products()->count() == 1 ? true : false;
        $deleteModel = $product->model->colors->count() == 1 ? true : false;

        $product->barcodes()->delete();
        $product->b2cStat()->delete();
        $product->delete();

        if ($deleteColorModel) {
            $productColor = $product->color;
            $productColor->colorIcon()->dissociate();
            $productColor->save();
            $productColor->images()->delete();
            $productColor->delete();
            if ($deleteModel) {
                $product->model->prices()->delete();
                $product->model->delete();
                return redirect()->route('system.products.models');
            }
        }

        DisableProductInSubiekt::dispatch($product->subiekt_id);
    }
}
