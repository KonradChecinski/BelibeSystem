<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("B2b/Dashboard");
})->middleware(["auth:client", "verified"])->name("b2b.dashboard");

Route::middleware(["auth:client", "verified"])->group(function () {
    Route::group([], function () {
        Route::get("/kategoria/{slug}", [ProductModelController::class, 'index'])->name("b2b.category");

    });

});

require __DIR__ . "/auth.php";
