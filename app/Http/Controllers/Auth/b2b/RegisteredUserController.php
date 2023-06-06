<?php

namespace App\Http\Controllers\Auth\b2b;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'routeLogin' => 'b2b.login',
            'routeRegister' => 'b2b.register',
        ]);
    }
}
