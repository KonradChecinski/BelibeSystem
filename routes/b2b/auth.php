<?php

use App\Http\Controllers\Auth\b2b\AuthenticatedSessionController;
use App\Http\Controllers\Auth\b2b\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('b2b.register');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('b2b.login');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('b2b.password.email');
});
