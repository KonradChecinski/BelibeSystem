<?php

namespace App\Http\Controllers\Auth\b2b;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'canRegister' => Route::has('b2b.register'),
            'status' => session('status'),
            'routeLogin' => "b2b.login",
            'routePasswordRequest' => 'password.request',
            'routeRegister' => 'b2b.register',
        ]);
    }
}
