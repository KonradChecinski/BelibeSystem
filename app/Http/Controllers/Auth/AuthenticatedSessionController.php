<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\Helper;
use App\Helpers\SystemName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {

        $request->authenticate(Helper::getGuardFromDomain($request));

        $request->session()->regenerate();

        $route = Helper::getSystemNameFromDomain($request) === SystemName::B2B ? route("b2b.dashboard") : RouteServiceProvider::HOME;

        return redirect()->intended($route);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(Helper::getGuardFromDomain($request))->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
