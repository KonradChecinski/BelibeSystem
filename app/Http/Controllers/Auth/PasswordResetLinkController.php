<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\Helper;
use App\Helpers\SystemName;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(Request $request): Response
    {
        switch (Helper::getSystemNameFromDomain($request)) {
            case SystemName::SYSTEM:
                $route = 'system.password.email';
                break;

            case SystemName::B2B:
                $route = 'b2b.password.email';
                break;

            default:
                $route = '';
                break;
        }

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'routePasswordEmail' => $route,
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        switch (Helper::getSystemNameFromDomain($request)) {
            case SystemName::SYSTEM:
                $brokerName = 'users';
                break;

            case SystemName::B2B:
                $brokerName = 'clients';
                break;

            default:
                $brokerName = '';
                break;
        }

        $status = Password::broker($brokerName)->sendResetLink(
            $request->only('email'),
        );

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
