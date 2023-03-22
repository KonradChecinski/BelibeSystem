<?php

use App\Http\Controllers\Auth\b2b\AuthenticatedSessionController;
use App\Http\Controllers\Auth\b2b\B2bConfirmablePasswordController;
use App\Http\Controllers\Auth\b2b\B2bEmailVerificationNotificationController;
use App\Http\Controllers\Auth\b2b\B2bEmailVerificationPromptController;
use App\Http\Controllers\Auth\b2b\B2bNewPasswordController;
use App\Http\Controllers\Auth\b2b\B2bPasswordController;
use App\Http\Controllers\Auth\b2b\B2bPasswordResetLinkController;
use App\Http\Controllers\Auth\b2b\B2bRegisteredUserController;
use App\Http\Controllers\Auth\b2b\B2bVerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [B2bRegisteredUserController::class, 'create'])
                ->name('b2b.register');

    Route::post('register', [B2bRegisteredUserController::class, 'store']);
});
