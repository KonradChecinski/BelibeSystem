<?php

use App\Http\Controllers\B2bProductCategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("B2b/Dashboard");
})->middleware(["auth:client", "verified"])->name("b2b.dashboard");

Route::middleware(["auth:client", "verified"])->group(function () {
    Route::group([], function () {
        Route::get("/c/{slug}", [B2bProductCategoryController::class, 'show'])->name("b2b.category");

    });

});

require __DIR__ . "/auth.php";
