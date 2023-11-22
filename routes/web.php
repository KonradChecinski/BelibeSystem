<?php

use App\Http\Controllers\ProfileController;
use App\Install\ClearDBController;
use App\Install\Install2Controller;
use App\Install\InstallController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

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

Route::get('storage/{path}', function ($path) {
    return Storage::get('public/' . str_replace('>', '/', $path));
})->name("storage");

Route::get('images/{path}', function ($path) {
    return Storage::get('images/' . str_replace('\\', '/', $path));
})->name("images");

Route::get('images1x1/{path}', function ($path) {
    return Storage::get('images/' . str_replace('\\', '/', $path));
    $image = ProductImage::query()->where();
    $path = $image->path;
    $img = Storage::get('images/' . str_replace('\\', '/', $path));

    $size = max($image->width, $image->height);
    $img = Image::canvas($size, $size, '#ffffff')->insert($img, 'center');

    header("Content-Type: image/jpeg");
    return $img->response('jpg', 100);
})->name("images1x1");


Route::get("install", [InstallController::class, 'install'])->name("install");
Route::get("install2", [Install2Controller::class, 'install'])->name("install2");
Route::get("cleardb", [ClearDBController::class, 'clear'])->name("cleardb");


require __DIR__ . "/auth.php";
