<?php

use App\Http\Controllers\StorageController;
use App\Http\Controllers\System\XmlGeneratorController;
use App\Install\ClearDBController;
use App\Install\Install2Controller;
use App\Install\Install3Controller;
use App\Install\Install1Controller;
use App\Install\Install4Controller;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//
//Route::get("/", function () {
//    //    return Inertia::render("Welcome", [
//    //        "canLogin" => Route::has("system.login"),
//    //        "canRegister" => Route::has("system.register"),
//    //        "laravelVersion" => Application::VERSION,
//    //        "phpVersion" => PHP_VERSION,
//    //
//    //        'routeLogin' => 'system.login',
//    //        'routeRegister' => 'system.register',
//    //        'routeDashboard' => 'system.dashboard',
//    //    ]);
//
//    dd($_SERVER);
//});

/*
|--------------------------------------------------------------------------
| System Routes
|--------------------------------------------------------------------------
*/
if (request()->getHttpHost() === "system." . config("app.domain")) {
    Route::domain("system." . config("app.domain"))->group(function () {
        require __DIR__ . "/system/system.php";

        Route::middleware(["auth:user", "verified", "userSessionHaveClientModel"])->group(function () {
            Route::group(["prefix" => "/b2b"], function () {
                require __DIR__ . "/b2b/b2b.php";
            });

        });

    });
}


/*
|--------------------------------------------------------------------------
| B2b Routes
|--------------------------------------------------------------------------
*/
if (request()->getHttpHost() === "b2b." . config("app.domain")) {

    Route::domain("b2b." . config("app.domain"))->group(function () {
        Route::middleware(["auth:client", "verified"])->group(function () {
            require __DIR__ . "/b2b/b2b.php";
        });

        require __DIR__ . "/b2b/auth.php";
    });
}

Route::get('assets/{path}', function ($path) {
//    return response()->file(public_path("$path"));
})->name("assets");

Route::get('storage/{path}', [StorageController::class, 'storage'])->name("storage");
Route::get('images/basic/{path}', [StorageController::class, 'images'])->name("images");
Route::get('images/thumbnail/{path}', [StorageController::class, 'imagesThumb'])->name("images.thumbnail");
Route::get('images/webp/{path}', [StorageController::class, 'imagesWebp'])->name("images.webp");
Route::get('images/1x1/{path}', [StorageController::class, 'imagesSquare'])->name("images.1x1");
Route::get('color-icons/{path}', [StorageController::class, 'colorIcons'])->name("colorIcons");


require __DIR__ . "/auth.php";
