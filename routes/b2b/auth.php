<?php

use App\Http\Controllers\Auth\b2b\AuthenticatedSessionController;
use App\Http\Controllers\Auth\b2b\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
                ->name('b2b.register');


    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('b2b.login');
});
