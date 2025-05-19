<?php

namespace App\Http\Controllers;

use App\Helpers\Warehouse\WarehouseApp;
use App\Models\Products\ProductBarcode;
use App\Http\Requests\WarehouseAppBarcodeSearchingRequest;
use App\Models\Subiekt\Towar;
use Illuminate\Support\Facades\DB;

class WarehouseAppBarcodeSearchingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function barcodeSearching(WarehouseAppBarcodeSearchingRequest $request)
    {
        $barcode = $request->input('barcode');

        $result = collect();

        // Check if the barcode exists in the database
        $productBarcode = ProductBarcode::where('barcode', $barcode)->first();
        if ($productBarcode) {
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

        $towar = Towar::query()->where('tw_PodstKodKresk', $barcode)->first();
        // If the barcode exists in the database, return the product information
        if ($towar) {
            $towarCena = $towar->cena;
            $productInfo = [
                "model" => null,
                "color" => null,
                "product" => [
                    'symbol' => $towar->tw_Symbol,
                    'name' => $towar->tw_Nazwa,
                    'quantity' => null,
                    'available' => null,
                    'size' => null,
                    'unit' => $towar->tw_JednStanMin,
                ],
                "images" => [],
                "prices" => [
                    'vat_rate' => $towar->tw_IdVatSp == 100001 ? 23 : null,
                    'wholesale_net_price' => $towarCena->tc_CenaNetto2 * 100,
                    'wholesale_gross_price' => $towarCena->tc_CenaBrutto2 * 100,
                    'retail_net_price' => $towarCena->tc_CenaNetto3 * 100,
                    'retail_gross_price' => $towarCena->tc_CenaBrutto3 * 100,
                    'b2c_net_price' => null,
                    'b2c_gross_price' => null,
                    'currency' => $towarCena->tc_IdWaluta3,
                ],
            ];

            $stock = WarehouseApp::getTowarQuantityInSubiektWarehouses($towar);

            $result->put('product', $productInfo);
            $result->put('stock', $stock);
            // Return the product information as a JSON response
            return response()->json($result);
        }

        $towarIdFromBarcode = DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_Kod", $barcode)->first();
        if ($towarIdFromBarcode) {
            $towar = Towar::query()->where('tw_Id', $towarIdFromBarcode->kk_IdTowar)->first();
            if ($towar) {
                $towarCena = $towar->cena;
                $productInfo = [
                    "model" => null,
                    "color" => null,
                    "product" => [
                        'symbol' => $towar->tw_Symbol,
                        'name' => $towar->tw_Nazwa,
                        'quantity' => null,
                        'available' => null,
                        'size' => null,
                        'unit' => $towar->tw_JednStanMin,
                    ],
                    "images" => [],
                    "prices" => [
                        'vat_rate' => $towar->tw_IdVatSp == 100001 ? 23 : null,
                        'wholesale_net_price' => $towarCena->tc_CenaNetto2 * 100,
                        'wholesale_gross_price' => $towarCena->tc_CenaBrutto2 * 100,
                        'retail_net_price' => $towarCena->tc_CenaNetto3 * 100,
                        'retail_gross_price' => $towarCena->tc_CenaBrutto3 * 100,
                        'b2c_net_price' => null,
                        'b2c_gross_price' => null,
                        'currency' => $towarCena->tc_IdWaluta3,
                    ],
                ];

                $stock = WarehouseApp::getTowarQuantityInSubiektWarehouses($towar);

                $result->put('product', $productInfo);
                $result->put('stock', $stock);
                // Return the product information as a JSON response
                return response()->json($result);
            }
        }


        // If the barcode does not exist, return an error response
        return response()->json(['error' => __('Barcode not found.')], 404);


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
