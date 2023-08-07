<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\Helper;
use App\Helpers\SystemName;
use App\Http\Controllers\Controller;
use App\Models\Client\ClientUser;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            "name" => "required|string|max:255",
            "email" =>
                "required|string|email|max:255|unique:" .
                ClientUser::class .
                "|unique:" .
                User::class,
            "password" => ["required", "confirmed", Rules\Password::defaults()],
        ]);

        $validatedUserCredential = [
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ];

        $systemName = Helper::getSystemNameFromDomain($request);
        if ($systemName == SystemName::SYSTEM) {
            $user = User::create($validatedUserCredential);
            $user->assignRole("Użytkownik");

        } elseif ($systemName == SystemName::B2B) {
            $user = ClientUser::create($validatedUserCredential);
        } else {
            return back();
        }

        event(new Registered($user));

        Auth::guard(Helper::getGuardFromDomain($request))->login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
