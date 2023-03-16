<?php

use App\Http\Controllers\Auth\b2b\B2bAuthenticatedSessionController;
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

    Route::get('login', [B2bAuthenticatedSessionController::class, 'create'])
                ->name('b2b.login');

    Route::post('login', [B2bAuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [B2bPasswordResetLinkController::class, 'create'])
                ->name('b2b.password.request');

    Route::post('forgot-password', [B2bPasswordResetLinkController::class, 'store'])
                ->name('b2b.password.email');

    Route::get('reset-password/{token}', [B2bNewPasswordController::class, 'create'])
                ->name('b2b.password.reset');

    Route::post('reset-password', [B2bNewPasswordController::class, 'store'])
                ->name('b2b.password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', B2bEmailVerificationPromptController::class)
                ->name('b2b.verification.notice');

    Route::get('verify-email/{id}/{hash}', B2bVerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('b2b.verification.verify');

    Route::post('email/verification-notification', [B2bEmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('b2b.verification.send');

    Route::get('confirm-password', [B2bConfirmablePasswordController::class, 'show'])
                ->name('b2b.password.confirm');

    Route::post('confirm-password', [B2bConfirmablePasswordController::class, 'store']);

    Route::put('password', [B2bPasswordController::class, 'update'])->name('b2b.password.update');

    Route::post('logout', [B2bAuthenticatedSessionController::class, 'destroy'])
                ->name('b2b.logout');
});
