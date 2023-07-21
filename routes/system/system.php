<?php

use App\Http\Controllers\Product\ProductModelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Settings\SettingsMainController;
use App\Http\Controllers\Settings\SettingsUsersController;
use App\Http\Controllers\SettingsPermissionsController;
use App\Http\Controllers\SettingsRolesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
//    return Inertia::render("Welcome", [
//        "canLogin" => Route::has("system.login"),
//        "canRegister" => Route::has("system.register"),
//        "laravelVersion" => Application::VERSION,
//        "phpVersion" => PHP_VERSION,
//
//        "routeLogin" => "system.login",
//        "routeRegister" => "system.register",
//        "routeDashboard" => "system.dashboard",
//    ]);
    return Inertia::render("Dashboard");
})->middleware(["auth:user", "verified"])->name("system.dashboard");;

//Route::get("/dashboard", function () {
//    return Inertia::render("Dashboard");
//})
//    ->middleware(["auth:user", "verified"])
//    ->name("system.dashboard");
//
//Route::get("/dashboard2", function () {
//    return Inertia::render("Dashboard2");
//})
//    ->middleware(["auth:user", "verified"])
//    ->name("system.dashboard2");
//
//Route::get("/dashboard3", function () {
//    return Inertia::render("Dashboard3");
//})
//    ->middleware(["auth:user", "verified"])
//    ->name("system.dashboard3");

Route::middleware("auth:user")->group(function () {
    Route::get("/models", [ProductModelController::class, 'index'])->name("system.products.models");
    Route::get("/models/data", [ProductModelController::class, 'data']);
    Route::get("/models/model/{id}", [ProductModelController::class, 'show'])->name("system.products.model");
    Route::get("/models/model/{id}/edit", [ProductModelController::class, 'edit'])->name("system.products.model.edit");

    Route::group(['prefix' => '/settings'], function () {
        Route::get("/", function () {
            return redirect()->route("system.settings.main");
        })->name("system.settings");

        Route::get("/main", [SettingsMainController::class, 'index'])->name("system.settings.main");
        Route::get("/user", [SettingsUsersController::class, 'index'])->name("system.settings.users");
        Route::get("/user/data", [SettingsUsersController::class, 'data']);
        Route::get("/permissions", [SettingsPermissionsController::class, 'index'])->name("system.settings.permissions");
        Route::get("/roles", [SettingsRolesController::class, 'index'])->name("system.settings.roles");
    });

    Route::group(['prefix' => '/profile'], function () {
        Route::get("/", [ProfileController::class, "edit"])->name("profile.edit");
        Route::patch("/", [ProfileController::class, "update"])->name("profile.update");
        Route::delete("/", [ProfileController::class, "destroy"])->name("profile.destroy");
    });


});

require __DIR__ . "/auth.php";
