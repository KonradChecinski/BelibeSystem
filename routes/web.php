<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    return response()->file(public_path("assets/$path"));
})->name("assets");

Route::get('images/{path}', function ($path) {
    return response()->file(public_path("assets/images/$path"));
})->name("images");
require __DIR__ . "/auth.php";
