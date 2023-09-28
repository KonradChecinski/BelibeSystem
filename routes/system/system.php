<?php

use App\Http\Controllers\Product\B2BProductModelController;
use App\Http\Controllers\Product\B2CProductModelController;
use App\Http\Controllers\Product\BasicProductModelController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductImageController;
use App\Http\Controllers\Product\ProductModelColorController;
use App\Http\Controllers\Product\ProductModelController;
use App\Http\Controllers\Product\ProductModelPriceController;
use App\Http\Controllers\Product\ShowProductController;
use App\Http\Controllers\ProductImageOrderController;
use App\Http\Controllers\ProductImagePublishController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Settings\SettingsMainController;
use App\Http\Controllers\Settings\SettingsPermissionsController;
use App\Http\Controllers\Settings\SettingsRolesController;
use App\Http\Controllers\Settings\SettingsUsersController;
use App\Http\Controllers\SettingsDictionarySizeController;
use App\Models\SettingsDictionarySize;
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

Route::middleware("auth:user")->group(function () {
    Route::get("/models", [ProductModelController::class, 'index'])->name("system.products.models");
    Route::get("/models/data", [ProductModelController::class, 'data']);
    Route::post("/models", [ProductModelController::class, 'store'])->name("system.products.models.create");
    Route::post("/models/{productModel}", [ProductModelController::class, 'copy'])->name("system.products.models.copy");
    Route::delete("/models/{productModel}", [ProductModelController::class, 'destroy'])->name("system.products.models.delete");

    Route::get("/models/model/{id}", [ProductModelController::class, 'show'])->name("system.products.model");
    Route::get("/models/model/{id}/edit", [ProductModelController::class, 'edit'])->name("system.products.model.edit");
    Route::post("/models/model/{model}/color", [ProductModelColorController::class, 'store'])->name("system.products.model.color");
    Route::post("/models/model/{productModel}/update/b2b", [B2BProductModelController::class, 'update'])->name("system.products.model.update.b2b");
    Route::post("/models/model/{productModel}/update/b2c", [B2CProductModelController::class, 'update'])->name("system.products.model.update.b2c");
    Route::post("/models/model/{productModel}/update/basic", [BasicProductModelController::class, 'update'])->name("system.products.model.update.basic");

    Route::post("/product/{product}/update/show", [ShowProductController::class, 'update'])->name("system.products.show.update");
    Route::post("/product/{modelColor}", [ProductController::class, 'store'])->name("system.products");
    Route::patch("/product/{product}", [ProductController::class, 'update'])->name("system.products.update");
    Route::delete("/product/{product}", [ProductController::class, 'destroy'])->name("system.products.delete");

    Route::post("/models/images/{modelColor}", [ProductImageController::class, 'store'])->name("system.products.images.create");
    Route::put("/models/images/{productModel}/order", [ProductImageOrderController::class, 'update'])->name("system.products.images.update.order");
    Route::patch("/models/images/{productImage}/publish", [ProductImagePublishController::class, 'update'])->name("system.products.images.update.publish");
    Route::delete("/models/images/{image}", [ProductImageController::class, 'destroy'])->name("system.products.images.delete");


    Route::post("price/{productModelPrice}", [ProductModelPriceController::class, 'update'])->name("system.products.model.price");
    Route::get("test", [\App\Http\Controllers\ClientController::class, 'index'])->name("system.test");

    Route::group(['prefix' => '/settings'], function () {
        Route::get("/", function () {
            return redirect()->route("system.settings.main");
        })->name("system.settings");

        Route::get("/main", [SettingsMainController::class, 'index'])->name("system.settings.main");

        Route::get("/user", [SettingsUsersController::class, 'index'])->name("system.settings.users");
        Route::post("/user", [SettingsUsersController::class, 'store']);
        Route::get("/user/data", [SettingsUsersController::class, 'data']);

        Route::get("/permissions", [SettingsPermissionsController::class, 'index'])->name("system.settings.permissions");

        Route::get("/roles", [SettingsRolesController::class, 'index'])->name("system.settings.roles");
        Route::post("/roles", [SettingsRolesController::class, 'store']);
        Route::get("/roles/{settingsRole}/edit", [SettingsRolesController::class, 'edit'])->name("system.settings.roles.edit");
        Route::post("/roles/{settingsRole}/edit", [SettingsRolesController::class, 'update']);

        Route::delete("/roles/{settingsRoles}", [SettingsRolesController::class, 'destroy']);
        Route::get("/roles/data", [SettingsRolesController::class, 'data']);

        Route::get("/dictionaries/sizes", [SettingsDictionarySizeController::class, 'index'])->name("system.settings.sizes");


    });

    Route::group(['prefix' => '/profile'], function () {
        Route::get("/", [ProfileController::class, "edit"])->name("profile.edit");
        Route::patch("/", [ProfileController::class, "update"])->name("profile.update");
        Route::delete("/", [ProfileController::class, "destroy"])->name("profile.destroy");
    });


});

require __DIR__ . "/auth.php";
