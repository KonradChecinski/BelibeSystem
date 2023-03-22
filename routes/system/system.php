<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("Welcome", [
        "canLogin" => Route::has("system.login"),
        "canRegister" => Route::has("system.register"),
        "laravelVersion" => Application::VERSION,
        "phpVersion" => PHP_VERSION,

        'routeLogin' => 'system.login',
        'routeRegister' => 'system.register',
        'routeDashboard' => 'system.dashboard',
    ]);
})->middleware(["auth:user"]);

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard");
})
    ->middleware(["auth:user", "verified"])
    ->name("system.dashboard");

Route::middleware("auth:user")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit"
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update"
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy"
    );
});

require __DIR__ . "/auth.php";
