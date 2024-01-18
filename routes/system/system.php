<?php

use App\Http\Controllers\B2cCategoryController;
use App\Http\Controllers\B2cColorController;
use App\Http\Controllers\GS1BrandController;
use App\Http\Controllers\GS1GPCController;
use App\Http\Controllers\Product\B2BProductModelController;
use App\Http\Controllers\Product\B2CProductModelController;
use App\Http\Controllers\Product\BasicProductModelController;
use App\Http\Controllers\Product\GS1ProductModelController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductGroupController;
use App\Http\Controllers\Product\ProductImageController;
use App\Http\Controllers\Product\ProductModelColorController;
use App\Http\Controllers\Product\ProductModelController;
use App\Http\Controllers\Product\ProductModelPriceController;
use App\Http\Controllers\Product\ProductSizeController;
use App\Http\Controllers\Product\ProductUnitController;
use App\Http\Controllers\Product\ShowProductController;
use App\Http\Controllers\Product\SubiektProductModelController;
use App\Http\Controllers\ProductBrandController;
use App\Http\Controllers\ProductImageOrderController;
use App\Http\Controllers\ProductImagePublishController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Settings\SettingsMainController;
use App\Http\Controllers\Settings\SettingsPermissionsController;
use App\Http\Controllers\Settings\SettingsRolesController;
use App\Http\Controllers\Settings\SettingsUsersController;
use App\Http\Controllers\XmlGeneratorController;
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

    Route::post("/models/model/{productModel}/update/basic", [BasicProductModelController::class, 'update'])->name("system.products.model.update.basic");
    Route::post("/models/model/{productModel}/update/b2c", [B2CProductModelController::class, 'update'])->name("system.products.model.update.b2c");
    Route::post("/models/model/{productModel}/update/b2b", [B2BProductModelController::class, 'update'])->name("system.products.model.update.b2b");
    Route::post("/models/model/{productModel}/update/subiekt", [SubiektProductModelController::class, 'update'])->name("system.products.model.update.subiekt");
    Route::post("/models/model/{productModel}/update/gs1", [GS1ProductModelController::class, 'update'])->name("system.products.model.update.gs1");

    Route::post("/product/{product}/update/show", [ShowProductController::class, 'update'])->name("system.products.show.update");
    Route::post("/product/{modelColor}", [ProductController::class, 'store'])->name("system.products");
    Route::patch("/product/{product}", [ProductController::class, 'update'])->name("system.products.update");
    Route::delete("/product/{product}", [ProductController::class, 'destroy'])->name("system.products.delete");

    Route::post("/models/images/{modelColor}", [ProductImageController::class, 'store'])->name("system.products.images.create");
    Route::put("/models/images/{productModel}/order", [ProductImageOrderController::class, 'update'])->name("system.products.images.update.order");
    Route::patch("/models/images/{productImage}/publish", [ProductImagePublishController::class, 'update'])->name("system.products.images.update.publish");
    Route::delete("/models/images/{image}", [ProductImageController::class, 'destroy'])->name("system.products.images.delete");


    Route::post("price/{productModelPrice}", [ProductModelPriceController::class, 'update'])->name("system.products.model.price");


    Route::group(['prefix' => '/settings'], function () {
        Route::get("/", function () {
            return redirect()->route("system.settings.main");
        })->name("system.settings");

        Route::get("/main", [SettingsMainController::class, 'index'])->name("system.settings.main");

        Route::get("/user", [SettingsUsersController::class, 'index'])->name("system.settings.users");
        Route::post("/user", [SettingsUsersController::class, 'store'])->name("system.settings.users.create");
        Route::patch("/user/{user}", [SettingsUsersController::class, 'update'])->name("system.settings.users.update");
        Route::get("/user/data", [SettingsUsersController::class, 'data']);

        Route::get("/permissions", [SettingsPermissionsController::class, 'index'])->name("system.settings.permissions");

        Route::get("/roles", [SettingsRolesController::class, 'index'])->name("system.settings.roles");
        Route::post("/roles", [SettingsRolesController::class, 'store']);
        Route::get("/roles/{settingsRole}/edit", [SettingsRolesController::class, 'edit'])->name("system.settings.roles.edit");
        Route::post("/roles/{settingsRole}/edit", [SettingsRolesController::class, 'update']);
        Route::delete("/roles/{settingsRoles}", [SettingsRolesController::class, 'destroy']);
        Route::get("/roles/data", [SettingsRolesController::class, 'data']);

        Route::group(['prefix' => '/dictionaries'], function () {
            Route::get("/sizes", [ProductSizeController::class, 'index'])->name("system.settings.sizes");
            Route::get("/sizes/data", [ProductSizeController::class, 'data']);
            Route::post("/sizes", [ProductSizeController::class, 'store'])->name("system.settings.sizes.create");
            Route::patch("/sizes/{productSize}", [ProductSizeController::class, 'update'])->name("system.settings.sizes.update");
            Route::delete("/sizes/{productSize}", [ProductSizeController::class, 'destroy'])->name("system.settings.sizes.delete");

            Route::get("/group", [ProductGroupController::class, 'index'])->name("system.settings.group");
            Route::get("/group/data", [ProductGroupController::class, 'data']);
            Route::post("/group", [ProductGroupController::class, 'store'])->name("system.settings.group.create");
            Route::patch("/group/{productGroup}", [ProductGroupController::class, 'update'])->name("system.settings.group.update");
            Route::delete("/group/{productGroup}", [ProductGroupController::class, 'destroy'])->name("system.settings.group.delete");

            Route::get("/unit", [ProductUnitController::class, 'index'])->name("system.settings.unit");
            Route::get("/unit/data", [ProductUnitController::class, 'data']);
            Route::post("/unit", [ProductUnitController::class, 'store'])->name("system.settings.unit.create");
            Route::patch("/unit/{productUnit}", [ProductUnitController::class, 'update'])->name("system.settings.unit.update");
            Route::delete("/unit/{productUnit}", [ProductUnitController::class, 'destroy'])->name("system.settings.unit.delete");

            Route::get("/brand/", [ProductBrandController::class, 'index'])->name("system.settings.brand");
            Route::get("/brand/data", [ProductBrandController::class, 'data']);
            Route::post("/brand", [ProductBrandController::class, 'store'])->name("system.settings.brand.create");
            Route::patch("/brand/{productBrand}", [ProductBrandController::class, 'update'])->name("system.settings.brand.update");
            Route::delete("/brand/{productBrand}", [ProductBrandController::class, 'destroy'])->name("system.settings.brand.delete");

            Route::group(['prefix' => '/gs1'], function () {
                Route::get("/gpc/", [GS1GPCController::class, 'index'])->name("system.settings.gs1.gpc");
                Route::get("/gpc/data", [GS1GPCController::class, 'data']);
                Route::post("/gpc", [GS1GPCController::class, 'store'])->name("system.settings.gs1.gpc.create");
                Route::patch("/gpc/{GS1GPC}", [GS1GPCController::class, 'update'])->name("system.settings.gs1.gpc.update");
                Route::delete("/gpc/{GS1GPC}", [GS1GPCController::class, 'destroy'])->name("system.settings.gs1.gpc.delete");

                Route::get("/brand/", [GS1BrandController::class, 'index'])->name("system.settings.gs1.brand");
                Route::get("/brand/data", [GS1BrandController::class, 'data']);
                Route::post("/brand", [GS1BrandController::class, 'store'])->name("system.settings.gs1.brand.create");
                Route::patch("/brand/{GS1Brand}", [GS1BrandController::class, 'update'])->name("system.settings.gs1.brand.update");
                Route::delete("/brand/{GS1Brand}", [GS1BrandController::class, 'destroy'])->name("system.settings.gs1.brand.delete");
            });

            Route::group(['prefix' => '/b2c'], function () {
                Route::get("/category/", [B2cCategoryController::class, 'index'])->name("system.settings.b2c.category");
                Route::get("/category/data", [B2cCategoryController::class, 'data']);
                Route::post("/category", [B2cCategoryController::class, 'store'])->name("system.settings.b2c.category.create");
                Route::patch("/category/{b2cCategory}", [B2cCategoryController::class, 'update'])->name("system.settings.b2c.category.update");
                Route::delete("/category/{b2cCategory}", [B2cCategoryController::class, 'destroy'])->name("system.settings.b2c.category.delete");

                Route::get("/color/", [B2cColorController::class, 'index'])->name("system.settings.b2c.color");
                Route::get("/color/data", [B2cColorController::class, 'data']);
                Route::post("/color", [B2cColorController::class, 'store'])->name("system.settings.b2c.color.create");
                Route::patch("/color/{b2cColor}", [B2cColorController::class, 'update'])->name("system.settings.b2c.color.update");
                Route::delete("/color/{b2cColor}", [B2cColorController::class, 'destroy'])->name("system.settings.b2c.color.delete");
            });

        });


    });

    Route::group(['prefix' => '/profile'], function () {
        Route::get("/", [ProfileController::class, "edit"])->name("profile.edit");
        Route::patch("/", [ProfileController::class, "update"])->name("profile.update");
        Route::delete("/", [ProfileController::class, "destroy"])->name("profile.destroy");
    });


});

Route::middleware("auth:user")->group(function () {

    Route::get("phpinfo", function () {
        phpinfo();
    })->name("system.phpinfo");
    Route::get("test", [\App\Http\Controllers\ClientController::class, 'index'])->name("system.test");
});


require __DIR__ . "/auth.php";
