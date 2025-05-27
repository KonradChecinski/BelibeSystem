<?php

namespace App\Http\Controllers;

use App\Helpers\Warehouse\WarehouseApp;
use App\Http\Requests\WarehouseAppBarcodeFindSymbolRequest;
use App\Http\Requests\WarehouseAppBarcodeSearchingBySymbolRequest;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Http\Requests\WarehouseAppBarcodeSearchingByBarcodeRequest;
use App\Models\Subiekt\Towar;
use Illuminate\Support\Facades\DB;

class WarehouseAppBarcodeSearchingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function barcodeSearching(WarehouseAppBarcodeSearchingByBarcodeRequest $request)
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
                    'barcodes' => $product->barcodes()->get(['barcode', 'main']),
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
            $TowarKody = collect();

            if ($towar->tw_PodstKodKresk) {
                $TowarKody->push([
                    'barcode' => $towar->tw_PodstKodKresk,
                    'main' => true
                ]);
            }
            $dodatkoweKody = DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_IdTowar", $towar->tw_Id)->get();
            if ($dodatkoweKody) {
                foreach ($dodatkoweKody as $kod) {
                    $TowarKody->push([
                        'barcode' => $kod->kk_Kod,
                        'main' => false
                    ]);
                }
            }


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
                    'barcodes' => $TowarKody
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
        // If the barcode exists in the database, return the product information
        if ($towarIdFromBarcode) {
            $towar = Towar::query()->where('tw_Id', $towarIdFromBarcode->kk_IdTowar)->first();
            if ($towar) {
                $towarCena = $towar->cena;

                $towarKody = collect();

                if ($towar->tw_PodstKodKresk) {
                    $towarKody->push([
                        'barcode' => $towar->tw_PodstKodKresk,
                        'main' => true
                    ]);
                }
                $dodatkoweKody = DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_IdTowar", $towar->tw_Id)->get();
                if ($dodatkoweKody) {
                    foreach ($dodatkoweKody as $kod) {
                        $towarKody->push([
                            'barcode' => $kod->kk_Kod,
                            'main' => false
                        ]);
                    }
                }


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
                        'barcodes' => $towarKody
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
        return response()->json(['error' => __('Barcode not found')], 404);


    }

    public function symbolSearching(WarehouseAppBarcodeSearchingBySymbolRequest $request)
    {
        $symbol = $request->input('symbol');

        $result = collect();

        // Check if the barcode exists in the database
        $product = Product::where('symbol', $symbol)->first();
        if ($product) {
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
                    'barcodes' => $product->barcodes()->get(['barcode', 'main']),
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

        $towar = Towar::query()->where('tw_Symbol', $symbol)->first();
        // If the barcode exists in the database, return the product information
        if ($towar) {
            $towarCena = $towar->cena;
            $TowarKody = collect();

            if ($towar->tw_PodstKodKresk) {
                $TowarKody->push([
                    'barcode' => $towar->tw_PodstKodKresk,
                    'main' => true
                ]);
            }
            $dodatkoweKody = DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_IdTowar", $towar->tw_Id)->get();
            if ($dodatkoweKody) {
                foreach ($dodatkoweKody as $kod) {
                    $TowarKody->push([
                        'barcode' => $kod->kk_Kod,
                        'main' => false
                    ]);
                }
            }


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
                    'barcodes' => $TowarKody
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


        // If the barcode does not exist, return an error response
        return response()->json(['error' => __('Symbol not found')], 404);
    }

    public function findSymbol(WarehouseAppBarcodeFindSymbolRequest $request)
    {
        $symbol = $request->input('symbol');

        $result = collect();

        // Check if the symbol exists in the database
        $towary = Towar::query()
            ->where('tw_Symbol', 'LIKE', "%{$symbol}%")
            ->where("tw_Zablokowany", 0)
            ->get();

        // If the symbol exists in the database, return the product information
        if (count($towary)) {
            foreach ($towary as $towar) {
                $result->push($towar->tw_Symbol);
            }

            return response()->json($result);
        }

        // If the symbol does not exist, return an error response
        return response()->json(['error' => __('Symbol not found')], 404);
    }

//    /**
//     * Update the specified resource in storage.
//     */
//    public function update(UpdateWarehouseAppBarcodeSearchingRequest $request)
//    {
//        //
//    }


}
