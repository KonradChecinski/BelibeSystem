<?php

use App\Http\Controllers\B2B\B2bCartController;
use App\Http\Controllers\B2B\B2bFavoritesController;
use App\Http\Controllers\B2B\B2bMainPageController;
use App\Http\Controllers\B2B\B2bProductCategoryController;
use App\Http\Controllers\B2B\B2bProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(["auth:client", "verified"])->group(function () {
    Route::group([], function () {
        Route::get("/", [B2bMainPageController::class, 'index'])->name("b2b.dashboard");

        Route::get("/c/{slug}", [B2bProductCategoryController::class, 'show'])->name("b2b.category");
        Route::get("/m/{slug}", [B2bProductController::class, 'show'])->name("b2b.model");

        Route::get("/model/search", [B2bProductController::class, 'search'])->name("b2b.model.search");

        Route::get("/favorites", [B2bFavoritesController::class, 'index'])->name("b2b.favorites");
        Route::patch("/favorite/update/{productModel}", [B2bFavoritesController::class, 'update'])->name("b2b.favorite.update");

        Route::get("/cart", [B2bCartController::class, 'index'])->name("b2b.cart");

    });

});

require __DIR__ . "/auth.php";
