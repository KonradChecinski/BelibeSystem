<?php

use App\Http\Controllers\SystemTokenController;
use App\Http\Controllers\WarehouseAppBarcodeSearchingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::middleware('auth.system')->group(function () {
    Route::group(['prefix' => "warehouse"], function () {
        Route::get('/', function () {
            return response()->json([
                'message' => 'Welcome to the warehouse API!'
            ]);
        })->name('api.warehouse.welcome');

        Route::get('/barcode-searching', [WarehouseAppBarcodeSearchingController::class, 'barcodeSearching'])
            ->name('api.warehouse.barcode-searching.barcodeSearching');

        Route::get('/symbol-searching', [WarehouseAppBarcodeSearchingController::class, 'symbolSearching'])
            ->name('api.warehouse.symbol-searching.symbolSearching');
    });
});
