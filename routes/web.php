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

/*
|--------------------------------------------------------------------------
| System Routes
|--------------------------------------------------------------------------
*/

Route::domain("system." . config('app.domain'))->group(function () {
    require __DIR__ . "/system/system.php";
});

/*
|--------------------------------------------------------------------------
| B2b Routes
|--------------------------------------------------------------------------
*/

Route::domain("b2b." . config('app.domain'))->group(function () {
    require __DIR__ . "/b2b/b2b.php";
});





require __DIR__ . "/auth.php";
