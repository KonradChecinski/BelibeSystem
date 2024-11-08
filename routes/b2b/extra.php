<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

use App\Http\Controllers\ExtraMainPageComponentsController;
use Illuminate\Support\Facades\Route;


Route::group([], function () {
    Route::get("/main/extra/bestsellers", [ExtraMainPageComponentsController::class, 'bestsellers'])->name("b2b.main.extra.bestsellers");


});


