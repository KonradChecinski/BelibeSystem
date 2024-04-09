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

Route::domain("system." . config("app.domain"))->group(function () {
    require __DIR__ . "/system/system.php";
});

/*
|--------------------------------------------------------------------------
| B2b Routes
|--------------------------------------------------------------------------
*/

Route::domain("b2b." . config("app.domain"))->group(function () {
    require __DIR__ . "/b2b/b2b.php";
});


Route::get('assets/{path}', function ($path) {
//    return response()->file(public_path("$path"));
})->name("assets");

Route::get('storage/{path}', [StorageController::class, 'storage'])->name("storage");
Route::get('images/basic/{path}', [StorageController::class, 'images'])->name("images");
Route::get('images/thumbnail/{path}', [StorageController::class, 'imagesThumb'])->name("images.thumbnail");
Route::get('images/webp/{path}', [StorageController::class, 'imagesWebp'])->name("images.webp");
Route::get('images/1x1/{path}', [StorageController::class, 'imagesSquare'])->name("images.1x1");
Route::get('color-icons/{path}', [StorageController::class, 'colorIcons'])->name("colorIcons");


Route::group(['prefix' => '/xml'], function () {
    Route::get("merkandi", [XmlGeneratorController::class, "merkandiGenerateProductsXML"])->name("xml.merkandi");
}
);


Route::get("install", [Install1Controller::class, 'install'])->name("install");
Route::get("install2", [Install2Controller::class, 'install'])->name("install2");
Route::get("install3", [Install3Controller::class, 'install'])->name("install3");
Route::get("install4", [Install4Controller::class, 'install'])->name("install4");
Route::get("cleardb", [ClearDBController::class, 'clear'])->name("cleardb");


require __DIR__ . "/auth.php";
