<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("B2b/Dashboard");
})->middleware(["auth:client", "verified"])->name("b2b.dashboard");

Route::middleware(["auth:client", "verified"])->group(function () {


});

require __DIR__ . "/auth.php";
