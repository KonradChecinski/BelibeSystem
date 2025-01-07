<?php

use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\system\AuthenticatedSessionController;
use App\Http\Controllers\Auth\system\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
//    Route::get("register", [RegisteredUserController::class, "create"])->name(
//        "system.register"
//    );

    Route::get("login", [AuthenticatedSessionController::class, "create",])->name("system.login");

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('system.password.email');
});
