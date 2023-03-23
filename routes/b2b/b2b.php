<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("Welcome", [
        "canLogin" => Route::has("b2b.login"),
        "canRegister" => Route::has("b2b.register"),
        "laravelVersion" => Application::VERSION,
        "phpVersion" => PHP_VERSION,

        'routeLogin' => 'b2b.login',
        'routeRegister' => 'b2b.register',
        'routeDashboard' => 'b2b.dashboard',
    ]);
})->middleware(["auth:client", "verified"]);

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard");
})
    ->middleware(["auth:client", "verified"])
    ->name("b2b.dashboard");

require __DIR__ . "/auth.php";
