<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

use App\Http\Controllers\B2B\B2bCartController;
use App\Http\Controllers\B2B\B2bFavoritesController;
use App\Http\Controllers\B2B\B2bMainPageController;
use App\Http\Controllers\B2B\B2bProductCategoryController;
use App\Http\Controllers\B2B\B2bProductController;
use App\Http\Controllers\B2bClientController;
use App\Http\Controllers\B2bInvoicesController;
use App\Http\Controllers\B2bOrderController;
use App\Http\Controllers\B2bPageController;
use App\Http\Controllers\B2bSettlementsController;
use Illuminate\Support\Facades\Route;


Route::group([], function () {
    Route::get("/", [B2bMainPageController::class, 'index'])->name("b2b.main");

    Route::get("/c/{slug}", [B2bProductCategoryController::class, 'show'])->name("b2b.category");
    Route::get("/m/{slug}", [B2bProductController::class, 'show'])->name("b2b.model");
    Route::get("/p/{slug}", [B2bPageController::class, 'show'])->name("b2b.page");

    Route::get("/model/search", [B2bProductController::class, 'search'])->name("b2b.model.search");

    Route::get("/favorites", [B2bFavoritesController::class, 'index'])->name("b2b.favorites");
    Route::patch("/favorite/update/{productModel}", [B2bFavoritesController::class, 'update'])->name("b2b.favorite.update");


    Route::get("/cart", [B2bCartController::class, 'index'])->name("b2b.cart");
    Route::post("/cart/update/{product}", [B2bCartController::class, 'update'])->name("b2b.cart.update");

    Route::get("/orders", [B2bOrderController::class, 'index'])->name("b2b.orders");
    Route::get("/order/show/{clientOrder}", [B2bOrderController::class, 'show'])->name("b2b.order.show");
    Route::post("/order/store", [B2bOrderController::class, 'store'])->name("b2b.order.store");
    Route::get("/order/success", [B2bOrderController::class, 'success'])->name("b2b.order.success");
    Route::post("/order/again/{clientOrder}", [B2bOrderController::class, 'again'])->name("b2b.order.again");

    Route::get("/invoices", [B2bInvoicesController::class, 'index'])->name("b2b.invoices");
    Route::get("/invoices/{invoice}", [B2bInvoicesController::class, 'show'])->name("b2b.invoices.invoice");

    Route::get("/settlements", [B2bSettlementsController::class, 'index'])->name("b2b.settlements");

    Route::get("/client", [B2bClientController::class, 'index'])->name("b2b.client");

});


