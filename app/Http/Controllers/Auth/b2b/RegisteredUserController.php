<?php

namespace App\Http\Controllers\Auth\b2b;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('B2B/Register', [
            'routeLogin' => 'b2b.login',
            'accountManagers' => User::query()
                ->where("account_manager", true)
                ->where("active", true)
                ->orderBy("lastname")
                ->get(["firstname", "lastname", "email", "phone"]),
//            'routeRegister' => 'b2b.register',
        ]);
    }
}
