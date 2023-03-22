<?php

use App\Http\Controllers\Auth\system\SystemAuthenticatedSessionController;
use App\Http\Controllers\Auth\system\SystemRegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [SystemRegisteredUserController::class, 'create'])
                ->name('system.register');

    Route::post('register', [SystemRegisteredUserController::class, 'store']);
});
