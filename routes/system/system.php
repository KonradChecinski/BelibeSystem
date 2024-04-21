<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\ProductColorIconController;
use App\Http\Controllers\System\Client\AdditionalClientController;
use App\Http\Controllers\System\Client\BasicClientController;
use App\Http\Controllers\System\Client\ClientActivityController;
use App\Http\Controllers\System\Client\ClientController;
use App\Http\Controllers\System\Client\ClientDiscountController;
use App\Http\Controllers\System\Client\ClientLocationController;
use App\Http\Controllers\System\Client\ClientNoteController;
use App\Http\Controllers\System\Client\ClientOrderController;
use App\Http\Controllers\System\Client\ClientPaymentDiscountController;
use App\Http\Controllers\System\Client\ClientTaskController;
use App\Http\Controllers\System\Client\ClientUserController;
use App\Http\Controllers\System\Product\B2BProductModelController;
use App\Http\Controllers\System\Product\B2cCategoryController;
use App\Http\Controllers\System\Product\B2cColorController;
use App\Http\Controllers\System\Product\B2CProductModelController;
use App\Http\Controllers\System\Product\BasicProductModelController;
use App\Http\Controllers\System\Product\GS1BrandController;
use App\Http\Controllers\System\Product\GS1GPCController;
use App\Http\Controllers\System\Product\GS1ProductModelController;
use App\Http\Controllers\System\Product\ProductBrandController;
use App\Http\Controllers\System\Product\ProductCategoryController;
use App\Http\Controllers\System\Product\ProductController;
use App\Http\Controllers\System\Product\ProductGroupController;
use App\Http\Controllers\System\Product\ProductImageController;
use App\Http\Controllers\System\Product\ProductImageOrderController;
use App\Http\Controllers\System\Product\ProductImagePublishController;
use App\Http\Controllers\System\Product\ProductModelColorController;
use App\Http\Controllers\System\Product\ProductModelController;
use App\Http\Controllers\System\Product\ProductModelPriceController;
use App\Http\Controllers\System\Product\ProductSizeController;
use App\Http\Controllers\System\Product\ProductUnitController;
use App\Http\Controllers\System\Product\ShowProductController;
use App\Http\Controllers\System\Product\SubiektProductModelController;
use App\Http\Controllers\System\ProfileController;
use App\Http\Controllers\System\Queries\QueryImagesController;
use App\Http\Controllers\System\Settings\SettingsMainController;
use App\Http\Controllers\System\Settings\SettingsPermissionsController;
use App\Http\Controllers\System\Settings\SettingsRolesController;
use App\Http\Controllers\System\Settings\SettingsUsersAccountManagerController;
use App\Http\Controllers\System\Settings\SettingsUsersActiveController;
use App\Http\Controllers\System\Settings\SettingsUsersController;
use App\Http\Controllers\System\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("System/Dashboard");
})->middleware(["auth:user", "verified"])->name("system.dashboard");


Route::middleware(["auth:user", "verified"])->group(function () {
    Route::group([], function () {
        Route::get("/models", [ProductModelController::class, 'index'])->name("system.products.models");
        Route::get("/models/data", [ProductModelController::class, 'data']);
        Route::get("/models/search", [ProductModelController::class, 'search'])->name("system.products.models.search");
        Route::post("/models", [ProductModelController::class, 'store'])->name("system.products.models.create");
        Route::post("/models/{productModel}", [ProductModelController::class, 'copy'])->name("system.products.models.copy");
        Route::delete("/models/{productModel}", [ProductModelController::class, 'destroy'])->name("system.products.models.delete");

        Route::get("/models/model/{id}", [ProductModelController::class, 'show'])->name("system.products.model");
        Route::get("/models/model/{id}/edit", [ProductModelController::class, 'edit'])->name("system.products.model.edit");
        Route::post("/models/model/{model}/color", [ProductModelColorController::class, 'store'])->name("system.products.model.color");
        Route::patch("/models/model/{model}/color/{productModelColor}", [ProductModelColorController::class, 'update'])->name("system.products.model.color.update");

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
    });
    Route::group([], function () {
        Route::get("/clients", [ClientController::class, 'index'])->name("system.clients");
        Route::get("/clients/data", [ClientController::class, 'data']);
        Route::get("/clients/search", [ClientController::class, 'search'])->name("system.clients.search");

        Route::post("/clients", [ClientController::class, 'store'])->name("system.clients.create");
//        Route::post("/clients/{productModel}", [ProductModelController::class, 'copy'])->name("system.products.models.copy");
//        Route::delete("/clients/{productModel}", [ProductModelController::class, 'destroy'])->name("system.products.models.delete");


        Route::get("/clients/client/{id}", [ClientController::class, 'show'])->name("system.clients.client");
        Route::get("/clients/client/{id}/edit", [ClientController::class, 'edit'])->name("system.clients.client.edit");


        Route::post("/clients/client/{client}/update/basic", [BasicClientController::class, 'update'])->name("system.clients.client.update.basic");
        Route::post("/clients/client/{client}/update/additional", [AdditionalClientController::class, 'update'])->name("system.clients.client.update.additional");

        Route::post("/clients/client/{client}/user/", [ClientUserController::class, 'store'])->name("system.clients.client.user");
        Route::patch("/clients/client/{client}/user/{clientUser}", [ClientUserController::class, 'update'])->name("system.clients.client.user.update");
        Route::delete("/clients/client/{client}/user/{clientUser}", [ClientUserController::class, 'destroy'])->name("system.clients.client.user.delete");

        Route::post("/clients/client/{client}/location/", [ClientLocationController::class, 'store'])->name("system.clients.client.location");
        Route::patch("/clients/client/{client}/location/{clientLocation}", [ClientLocationController::class, 'update'])->name("system.clients.client.location.update");
        Route::delete("/clients/client/{client}/location/{clientLocation}", [ClientLocationController::class, 'destroy'])->name("system.clients.client.location.delete");

        Route::post("/clients/client/{client}/discount/", [ClientDiscountController::class, 'store'])->name("system.clients.client.discount");
        Route::patch("/clients/client/{client}/discount/{clientDiscount}", [ClientDiscountController::class, 'update'])->name("system.clients.client.discount.update");
        Route::delete("/clients/client/{client}/discount/{clientDiscount}", [ClientDiscountController::class, 'destroy'])->name("system.clients.client.discount.delete");

        Route::patch("/clients/client/{client}/payment/discount/{b2bPayment}", [ClientPaymentDiscountController::class, 'update'])->name("system.clients.client.payment.discount.update");

        Route::post("/clients/client/{client}/activity/", [ClientActivityController::class, 'store'])->name("system.clients.client.activity");
        Route::patch("/clients/client/{client}/activity/{clientActivity}", [ClientActivityController::class, 'update'])->name("system.clients.client.activity.update");
        Route::delete("/clients/client/{client}/activity/{clientActivity}", [ClientActivityController::class, 'destroy'])->name("system.clients.client.activity.delete");

        Route::post("/clients/client/{client}/task/", [ClientTaskController::class, 'store'])->name("system.clients.client.task");
        Route::patch("/clients/client/{client}/task/{clientTask}", [ClientTaskController::class, 'update'])->name("system.clients.client.task.update");
        Route::delete("/clients/client/{client}/task/{clientTask}", [ClientTaskController::class, 'destroy'])->name("system.clients.client.task.delete");

        Route::post("/clients/client/{client}/note/", [ClientNoteController::class, 'store'])->name("system.clients.client.note");
        Route::patch("/clients/client/{client}/note/{clientNote}", [ClientNoteController::class, 'update'])->name("system.clients.client.note.update");
        Route::delete("/clients/client/{client}/note/{clientNote}", [ClientNoteController::class, 'destroy'])->name("system.clients.client.note.delete");


        Route::post("/b2b/order/start/{client}", [ClientOrderController::class, 'store'])->name("system.b2b.order.start");
        Route::post("/b2b/order/end", [ClientOrderController::class, 'destroy'])->name("system.b2b.order.end");

    });


    Route::group(['prefix' => '/settings'], function () {
        Route::get("/", function () {
            return redirect()->route("system.settings.main");
        })->name("system.settings");

        Route::get("/main", [SettingsMainController::class, 'index'])->name("system.settings.main");

        Route::get("/user", [SettingsUsersController::class, 'index'])->name("system.settings.users");
        Route::post("/user", [SettingsUsersController::class, 'store'])->name("system.settings.users.create");
        Route::patch("/user/{user}", [SettingsUsersController::class, 'update'])->name("system.settings.users.update");
        Route::patch("/user/{user}/active", [SettingsUsersActiveController::class, 'update'])->name("system.settings.users.update.active");
        Route::patch("/user/{user}/accountManager", [SettingsUsersAccountManagerController::class, 'update'])->name("system.settings.users.update.accountManager");
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

            Route::get("/category/", [ProductCategoryController::class, 'index'])->name("system.settings.category");
            Route::post("/category/", [ProductCategoryController::class, 'store'])->name("system.settings.category.create");
            Route::put("/category/", [ProductCategoryController::class, 'update'])->name("system.settings.category.update");
            Route::delete("/category/{productCategory}/", [ProductCategoryController::class, 'destroy'])->name("system.settings.category.delete");

            Route::get("/color-icon/", [ProductColorIconController::class, 'index'])->name("system.settings.colorIcon");
            Route::post("/color-icon/", [ProductColorIconController::class, 'store'])->name("system.settings.colorIcon.create");
            Route::post("/color-icon/update", [ProductColorIconController::class, 'update'])->name("system.settings.colorIcon.update");
            Route::delete("/color-icon/{productColorIcon}/", [ProductColorIconController::class, 'destroy'])->name("system.settings.colorIcon.delete");


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

    Route::group(["prefix" => "/queries"], function () {
        Route::get("/images/", [QueryImagesController::class, 'index'])->name("system.queries.images");

    });

    Route::group(["prefix" => "/pages"], function () {
        Route::get("/", [PagesController::class, 'index'])->name("system.pages");

    });

    Route::group(['prefix' => '/profile'], function () {
        Route::get("/", [ProfileController::class, "edit"])->name("profile.edit");
        Route::patch("/", [ProfileController::class, "update"])->name("profile.update");
        Route::delete("/", [ProfileController::class, "destroy"])->name("profile.destroy");
    });


});

Route::middleware(["auth:user", "verified"])->group(function () {

    Route::get("phpinfo", function () {
        phpinfo();
    })->name("system.phpinfo");
    Route::get("test", [TestController::class, 'index'])->name("system.test");
    Route::get("barcode", [TestController::class, 'store'])->name("system.test.barcodes");
});


require __DIR__ . "/auth.php";
