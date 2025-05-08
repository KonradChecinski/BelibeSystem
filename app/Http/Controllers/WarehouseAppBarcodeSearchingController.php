<?php

namespace App\Http\Controllers;

use App\Helpers\Warehouse\WarehouseApp;
use App\Models\Products\ProductBarcode;
use App\Http\Requests\WarehouseAppBarcodeSearchingRequest;

class WarehouseAppBarcodeSearchingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function barcodeSearching(WarehouseAppBarcodeSearchingRequest $request)
    {
        $barcode = $request->input('barcode');

        // Check if the barcode exists in the database
        $productBarcode = ProductBarcode::where('barcode', $barcode)->first();
        if (!$productBarcode) {
            return response()->json(['error' => 'Barcode not found.'], 404);
        }
        $result = collect();

        $product = $productBarcode->product;
        $productInfo = [
            "model" => [
                "id" => $product->model->id,
                "name" => $product->model->name,
                "symbol" => $product->model->symbol,
            ],
            "color" => [
                "id" => $product->color->id,
                "name" => $product->color->name,
                "shortcut" => $product->color->shortcut,
            ],
            "product" => [
                'symbol' => $product->symbol,
                'name' => $product->name,
                'quantity' => $product->quantity,
                'available' => $product->available,
                'size' => $product->size?->name,
                'unit' => $product->unit?->name,
            ],
            "images" => $product->images()->where('type', 1)->get(['slug', 'order', 'main']),
            "prices" => $product->prices()->first([
                'vat_rate',
                'wholesale_net_price',
                'wholesale_gross_price',
                'retail_net_price',
                'retail_gross_price',
                'b2c_net_price',
                'b2c_gross_price',
                'currency',
            ]),
        ];

        $stock = WarehouseApp::getTowarQuantityInSubiektWarehouses($product->towar);

//        $result->put('product', $product);
        $result->put('product', $productInfo);
        $result->put('stock', $stock);


        return response()->json($result);
    }


//    /**
//     * Update the specified resource in storage.
//     */
//    public function update(UpdateWarehouseAppBarcodeSearchingRequest $request)
//    {
//        //
//    }


    private function getProductBarcode($barcode)
    {
        return ProductBarcode::where('barcode', $barcode)->first();
    }

}
