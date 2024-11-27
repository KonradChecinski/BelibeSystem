<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

use App\Http\Controllers\AllegroTokenController;
use App\Http\Controllers\B2bDeliveryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DynamicFooterController;
use App\Http\Controllers\DynamicHeaderController;
use App\Http\Controllers\DynamicMainPageController;
use App\Http\Controllers\DynamicPageController;
use App\Http\Controllers\InvoiceB2bController;
use App\Http\Controllers\OrderB2bController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderOtherController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PartnerExportController;
use App\Http\Controllers\PartnerExportProductController;
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
use App\Http\Controllers\System\Product\B2bActivityTypeController;
use App\Http\Controllers\System\Product\B2bCountryController;
use App\Http\Controllers\System\Product\B2bIndustryController;
use App\Http\Controllers\System\Product\B2bPaymentController;
use App\Http\Controllers\System\Product\B2BProductModelController;
use App\Http\Controllers\System\Product\B2bSourceOfAcquisitionController;
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
use App\Http\Controllers\System\XmlGeneratorController;
use App\Http\Controllers\WarehouseDocumentController;
use App\Install\ClearDBController;
use App\Install\Install10Controller;
use App\Install\Install1Controller;
use App\Install\Install2Controller;
use App\Install\Install3Controller;
use App\Install\Install4Controller;
use App\Install\Install5Controller;
use App\Install\Install6Controller;
use App\Install\Install7Controller;
use App\Install\Install8Controller;
use App\Install\Install9Controller;
use Illuminate\Support\Facades\Route;


Route::middleware(["auth:user", "verified"])->group(function () {
    Route::get("/", [DashboardController::class, 'index'])->name("system.dashboard");

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

        Route::group(["prefix" => "/clients"], function () {
            Route::get("/", [ClientController::class, 'index'])->name("system.clients");
            Route::get("/data", [ClientController::class, 'data']);
            Route::get("/search", [ClientController::class, 'search'])->name("system.clients.search");

            Route::post("/", [ClientController::class, 'store'])->name("system.clients.create");
//        Route::post("/{productModel}", [ProductModelController::class, 'copy'])->name("system.products.models.copy");
//        Route::delete("/{productModel}", [ProductModelController::class, 'destroy'])->name("system.products.models.delete");


            Route::get("/client/{id}", [ClientController::class, 'show'])->name("system.clients.client");
            Route::get("/client/{id}/edit", [ClientController::class, 'edit'])->name("system.clients.client.edit");


            Route::post("/client/{client}/update/basic", [BasicClientController::class, 'update'])->name("system.clients.client.update.basic");
            Route::post("/client/{client}/update/additional", [AdditionalClientController::class, 'update'])->name("system.clients.client.update.additional");

            Route::post("/client/{client}/user/", [ClientUserController::class, 'store'])->name("system.clients.client.user");
            Route::patch("/client/{client}/user/{clientUser}", [ClientUserController::class, 'update'])->name("system.clients.client.user.update");
            Route::delete("/client/{client}/user/{clientUser}", [ClientUserController::class, 'destroy'])->name("system.clients.client.user.delete");

            Route::post("/client/{client}/location/", [ClientLocationController::class, 'store'])->name("system.clients.client.location");
            Route::patch("/client/{client}/location/{clientLocation}", [ClientLocationController::class, 'update'])->name("system.clients.client.location.update");
            Route::delete("/client/{client}/location/{clientLocation}", [ClientLocationController::class, 'destroy'])->name("system.clients.client.location.delete");

            Route::post("/client/{client}/discount/", [ClientDiscountController::class, 'store'])->name("system.clients.client.discount");
            Route::patch("/client/{client}/discount/{clientDiscount}", [ClientDiscountController::class, 'update'])->name("system.clients.client.discount.update");
            Route::delete("/client/{client}/discount/{clientDiscount}", [ClientDiscountController::class, 'destroy'])->name("system.clients.client.discount.delete");

            Route::patch("/client/{client}/payment/discount/{b2bPayment}", [ClientPaymentDiscountController::class, 'update'])->name("system.clients.client.payment.discount.update");

            Route::post("/client/{client}/activity/", [ClientActivityController::class, 'store'])->name("system.clients.client.activity");
            Route::patch("/client/{client}/activity/{clientActivity}", [ClientActivityController::class, 'update'])->name("system.clients.client.activity.update");
            Route::delete("/client/{client}/activity/{clientActivity}", [ClientActivityController::class, 'destroy'])->name("system.clients.client.activity.delete");

            Route::post("/client/{client}/task/", [ClientTaskController::class, 'store'])->name("system.clients.client.task");
            Route::patch("/client/{client}/task/{clientTask}", [ClientTaskController::class, 'update'])->name("system.clients.client.task.update");
            Route::post("/client/{client}/task/{clientTask}", [ClientTaskController::class, 'done'])->name("system.clients.client.task.done");
            Route::delete("/client/{client}/task/{clientTask}", [ClientTaskController::class, 'destroy'])->name("system.clients.client.task.delete");

            Route::post("/client/{client}/note/", [ClientNoteController::class, 'store'])->name("system.clients.client.note");
            Route::patch("/client/{client}/note/{clientNote}", [ClientNoteController::class, 'update'])->name("system.clients.client.note.update");
            Route::delete("/client/{client}/note/{clientNote}", [ClientNoteController::class, 'destroy'])->name("system.clients.client.note.delete");

            Route::post("/order/b2b/start/{client}", [ClientOrderController::class, 'store'])->name("system.b2b.order.start");
            Route::post("/order/b2b/end", [ClientOrderController::class, 'destroy'])->name("system.b2b.order.end");

            Route::get("/gus/{nip}", [ClientController::class, 'getDataFromGUS'])->name("system.clients.findGus");
        });


    });

    Route::group(["prefix" => "/orders"], function () {
        Route::get("/b2b", [OrderB2bController::class, 'index'])->name("system.orders.b2b");
        Route::get("/other", [OrderOtherController::class, 'index'])->name("system.orders.other");

        Route::get("/b2b/{clientOrder}", [ClientOrderController::class, 'show'])->name("system.orders.order.b2b");
        Route::get("/b2b/{clientOrder}/edit", [ClientOrderController::class, 'edit'])->name("system.orders.order.b2b.edit");
        Route::patch("/b2b/{clientOrder}", [ClientOrderController::class, 'update'])->name("system.orders.order.b2b.update");
        Route::patch("/b2b/{clientOrder}/product/{product}", [ClientOrderController::class, 'updateProduct'])->name("system.orders.order.b2b.update.product");

        Route::patch("/b2b/{clientOrder}/status", [ClientOrderController::class, 'updateStatus'])->name("system.orders.order.b2b.update.status");
        Route::post("/b2b/{clientOrder}/invoice", [ClientOrderController::class, 'createInvoice'])->name("system.orders.order.b2b.create.invoice");


        Route::get("/other/{order}", [OrderOtherController::class, 'show'])->name("system.orders.order.other");

    });


    Route::group(["prefix" => "/invoices"], function () {
        Route::get("/{invoice}", [InvoiceB2bController::class, 'show'])->name("system.invoices.invoice");

    });

    Route::group(["prefix" => "/warehouse"], function () {
        Route::get("/documents", [WarehouseDocumentController::class, 'currentDocuments'])->name("system.warehouse.documents");
        Route::get("/documents/archive", [WarehouseDocumentController::class, 'archivalDocuments'])->name("system.warehouse.documents.archival");

        Route::get("/document/{warehouseDocument}/print", [WarehouseDocumentController::class, 'print'])->name("system.warehouse.document.print");
        Route::get("/document/{warehouseDocument}/edit", [WarehouseDocumentController::class, 'edit'])->name("system.warehouse.document.edit");
        Route::put("/document/{warehouseDocument}/edit", [WarehouseDocumentController::class, 'update'])->name("system.warehouse.document.update");
        Route::post("/document/{warehouseDocument}/accept", [WarehouseDocumentController::class, 'store'])->name("system.warehouse.document.accept");

        Route::get("/document/{warehouseDocument}/products/search", [WarehouseDocumentController::class, 'search'])->name("system.warehouse.products.search");


    });

    Route::group(["prefix" => "/partners"], function () {
        Route::get("/", [PartnerController::class, 'index'])->name("system.partners");
        Route::post("/", [PartnerController::class, 'store'])->name("system.partners.create");
        Route::get("/{partner}", [PartnerController::class, 'edit'])->name("system.partners.partner.edit");
        Route::patch("/{partner}", [PartnerController::class, 'update'])->name("system.partners.partner.update");
        Route::delete("/{partner}", [PartnerController::class, 'destroy'])->name("system.partners.partner.delete");

        Route::post("/{partner}/products/{product}", [PartnerExportProductController::class, 'store'])->name("system.partners.partner.products.create");
        Route::delete("/{partner}/products/{product}", [PartnerExportProductController::class, 'destroy'])->name("system.partners.partner.products.delete");
        Route::get("/products/search", [PartnerExportProductController::class, 'search'])->name("system.partners.products.search");

        Route::post("/{partner}/export/", [PartnerExportController::class, 'store'])->name("system.partners.partner.export.create");
        Route::patch("/{partner}/export/{export}", [PartnerExportController::class, 'update'])->name("system.partners.partner.export.update");
        Route::delete("/{partner}/export/{export}", [PartnerExportController::class, 'destroy'])->name("system.partners.partner.export.delete");
        Route::post("/{partner}/export/{export}/runUpdate", [PartnerExportController::class, 'runUpdate'])->name("system.partners.partner.export.runUpdate");

    });

    Route::group(["prefix" => "/queries"], function () {
        Route::get("/images/", [QueryImagesController::class, 'index'])->name("system.queries.images");

    });

    Route::group(["prefix" => "/pages"], function () {

        Route::group(["prefix" => "/header"], function () {
            Route::get("/edit", [DynamicHeaderController::class, 'edit'])->name("system.pages.header.edit");
            Route::patch("/edit", [DynamicHeaderController::class, 'update'])->name("system.pages.header.update");
        });

        Route::group(["prefix" => "/footer"], function () {
            Route::get("/edit", [DynamicFooterController::class, 'edit'])->name("system.pages.footer.edit");
            Route::patch("/edit", [DynamicFooterController::class, 'update'])->name("system.pages.footer.update");
        });

        Route::group(["prefix" => "/main"], function () {
            Route::get("/edit", [DynamicMainPageController::class, 'edit'])->name("system.pages.main.edit");
            Route::patch("/edit", [DynamicMainPageController::class, 'update'])->name("system.pages.main.update");
        });

        Route::get("/links", [DynamicPageController::class, 'link'])->name("system.pages.links");


        Route::get("/", [DynamicPageController::class, 'index'])->name("system.pages");
        Route::get("/page", [DynamicPageController::class, 'create'])->name("system.pages.page");
        Route::post("/create", [DynamicPageController::class, 'store'])->name("system.pages.page.create");
        Route::get("/{dynamicPage}/edit", [DynamicPageController::class, 'edit'])->name("system.pages.page.edit");
        Route::patch("/{dynamicPage}", [DynamicPageController::class, 'update'])->name("system.pages.page.update");
        Route::delete("/{dynamicPage}", [DynamicPageController::class, 'destroy'])->name("system.pages.page.delete");


    });

    Route::group(['prefix' => '/profile'], function () {
        Route::get("/", [ProfileController::class, "edit"])->name("profile.edit");
        Route::patch("/", [ProfileController::class, "update"])->name("profile.update");
        Route::delete("/", [ProfileController::class, "destroy"])->name("profile.destroy");
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

            Route::group(['prefix' => '/models'], function () {


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

            Route::group(['prefix' => '/b2b'], function () {

//                Industries
                Route::get("/industry/", [B2bIndustryController::class, 'index'])->name("system.settings.industry");
                Route::post("/industry/", [B2bIndustryController::class, 'store'])->name("system.settings.industry.create");
                Route::patch("/industry/{b2bIndustry}", [B2bIndustryController::class, 'update'])->name("system.settings.industry.update");
                Route::delete("/industry/{b2bIndustry}", [B2bIndustryController::class, 'destroy'])->name("system.settings.industry.delete");

//                source_of_acquisitions
                Route::get("/acquisition/", [B2bSourceOfAcquisitionController::class, 'index'])->name("system.settings.acquisition");
                Route::post("/acquisition/", [B2bSourceOfAcquisitionController::class, 'store'])->name("system.settings.acquisition.create");
                Route::patch("/acquisition/{b2bSourceOfAcquisition}", [B2bSourceOfAcquisitionController::class, 'update'])->name("system.settings.acquisition.update");
                Route::delete("/acquisition/{b2bSourceOfAcquisition}", [B2bSourceOfAcquisitionController::class, 'destroy'])->name("system.settings.acquisition.delete");

//                countries
                Route::get("/country/", [B2bCountryController::class, 'index'])->name("system.settings.country");
                Route::post("/country/", [B2bCountryController::class, 'store'])->name("system.settings.country.create");
                Route::patch("/country/{b2bCountry}", [B2bCountryController::class, 'update'])->name("system.settings.country.update");
                Route::delete("/country/{b2bCountry}", [B2bCountryController::class, 'destroy'])->name("system.settings.country.delete");

//                activity_types
                Route::get("/activity/", [B2bActivityTypeController::class, 'index'])->name("system.settings.activity");
                Route::post("/activity/", [B2bActivityTypeController::class, 'store'])->name("system.settings.activity.create");
                Route::patch("/activity/{b2bActivityType}", [B2bActivityTypeController::class, 'update'])->name("system.settings.activity.update");
                Route::delete("/activity/{b2bActivityType}", [B2bActivityTypeController::class, 'destroy'])->name("system.settings.activity.delete");

//                payments
                Route::get("/payment/", [B2bPaymentController::class, 'index'])->name("system.settings.payment");
                Route::post("/payment/", [B2bPaymentController::class, 'store'])->name("system.settings.payment.create");
                Route::patch("/payment/{b2bPayment}", [B2bPaymentController::class, 'update'])->name("system.settings.payment.update");
                Route::delete("/payment/{b2bPayment}", [B2bPaymentController::class, 'destroy'])->name("system.settings.payment.delete");

//                deliveries
                Route::get("/delivery/", [B2bDeliveryController::class, 'index'])->name("system.settings.delivery");
                Route::post("/delivery/", [B2bDeliveryController::class, 'store'])->name("system.settings.delivery.create");
                Route::patch("/delivery/{b2bDelivery}", [B2bDeliveryController::class, 'update'])->name("system.settings.delivery.update");
                Route::delete("/delivery/{b2bDelivery}", [B2bDeliveryController::class, 'destroy'])->name("system.settings.delivery.delete");

            });

        });

        Route::group(['prefix' => '/allegro'], function () {
            Route::get("/status", [AllegroTokenController::class, 'index'])->name("system.settings.allegro.status");
            Route::get("/get-token", [AllegroTokenController::class, 'create'])->name("system.settings.allegro.getToken");
            Route::get("/token", [AllegroTokenController::class, 'token'])->name("system.settings.allegro.token");
            Route::post("/refresh-token", [AllegroTokenController::class, 'refresh'])->name("system.settings.allegro.refreshToken");

        });
    });
});

Route::middleware(["auth:user", "verified"])->group(function () {

    Route::get("phpinfo", function () {
        phpinfo();
    })->name("system.phpinfo");
    Route::get("test", [TestController::class, 'index'])->name("system.test");
    Route::get("test/fz", [TestController::class, 'invoiceStart'])->name("system.test.fz");
    Route::get("barcode", [TestController::class, 'store'])->name("system.test.barcodes");


//    Route::group(['prefix' => '/xml'], function () {
//        Route::get("merkandi", [XmlGeneratorController::class, "merkandiGenerateProductsXML"])->name("xml.merkandi");
//    }
//    );


    Route::get("install", [Install1Controller::class, 'install'])->name("install");
    Route::get("install2", [Install2Controller::class, 'install'])->name("install2");
    Route::get("install3", [Install3Controller::class, 'install'])->name("install3");
    Route::get("install4", [Install4Controller::class, 'install'])->name("install4");

    Route::get("install5", [Install5Controller::class, 'install'])->name("install5");
    Route::get("install6", [Install6Controller::class, 'install'])->name("install6");

    Route::get("install7", [Install7Controller::class, 'install'])->name("install7");

    Route::get("install8", [Install8Controller::class, 'install'])->name("install8");

    Route::get("install9", [Install9Controller::class, 'install'])->name("install9");

    Route::get("install10", [Install10Controller::class, 'install'])->name("install10");

    Route::get("cleardb", [ClearDBController::class, 'clear'])->name("cleardb");
});

Route::group(["prefix" => "/partner"], function () {
    Route::get("/{uuid}", [PartnerExportController::class, 'show'])->name("system.partner.show");
});


require __DIR__ . "/auth.php";
