<?php

use App\Http\Controllers\Auth\system\SystemAuthenticatedSessionController;
use App\Http\Controllers\Auth\system\SystemConfirmablePasswordController;
use App\Http\Controllers\Auth\system\SystemEmailVerificationNotificationController;
use App\Http\Controllers\Auth\system\SystemEmailVerificationPromptController;
use App\Http\Controllers\Auth\system\SystemNewPasswordController;
use App\Http\Controllers\Auth\system\SystemPasswordController;
use App\Http\Controllers\Auth\system\SystemPasswordResetLinkController;
use App\Http\Controllers\Auth\system\SystemRegisteredUserController;
use App\Http\Controllers\Auth\system\SystemVerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [SystemRegisteredUserController::class, 'create'])
                ->name('system.register');

    Route::post('register', [SystemRegisteredUserController::class, 'store']);

    Route::get('login', [SystemAuthenticatedSessionController::class, 'create'])
                ->name('system.login');

    Route::post('login', [SystemAuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [SystemPasswordResetLinkController::class, 'create'])
                ->name('system.password.request');

    Route::post('forgot-password', [SystemPasswordResetLinkController::class, 'store'])
                ->name('system.password.email');

    Route::get('reset-password/{token}', [SystemNewPasswordController::class, 'create'])
                ->name('system.password.reset');

    Route::post('reset-password', [SystemNewPasswordController::class, 'store'])
                ->name('system.password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', SystemEmailVerificationPromptController::class)
                ->name('system.verification.notice');

    Route::get('verify-email/{id}/{hash}', SystemVerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('system.verification.verify');

    Route::post('email/verification-notification', [SystemEmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('system.verification.send');

    Route::get('confirm-password', [SystemConfirmablePasswordController::class, 'show'])
                ->name('system.password.confirm');

    Route::post('confirm-password', [SystemConfirmablePasswordController::class, 'store']);

    Route::put('password', [SystemPasswordController::class, 'update'])->name('system.password.update');

    Route::post('logout', [SystemAuthenticatedSessionController::class, 'destroy'])
                ->name('system.logout');
});
