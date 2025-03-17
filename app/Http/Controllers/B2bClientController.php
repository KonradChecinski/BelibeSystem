<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Requests\UpdateB2bClientEmailRequest;
use App\Http\Requests\UpdateB2bClientPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class B2bClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();
        $client->load(["country", "accountManager"]);

        return Inertia::render('B2B/ClientZone', [
            'client' => $client
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Update the client's password.
     */
    public function updatePassword(UpdateB2bClientPasswordRequest $request)
    {
        $clientUser = auth()->user();
        if (!$clientUser) return redirect()->back()->withErrors(['email' => 'Unauthorized']);

        if ($request->password && strlen($request->password) > 0) {
            $clientUser->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => null,
            ])->save();
            event(new PasswordReset($clientUser));
        }

        (new AuthenticatedSessionController())->destroy($request);

        return redirect()->back();
    }

    /**
     * Update the client's email.
     */
    public function updateEmail(UpdateB2bClientEmailRequest $request)
    {
        $clientUser = auth()->user();
        if (!$clientUser) return redirect()->back()->withErrors(['email' => 'Unauthorized']);
        $clientUser->update([
            'email' => $request->email
        ]);

        $clientUser->forceFill([
            'email_verified_at' => null,
        ])->save();
        event(new Registered($clientUser));

        return redirect()->back();
    }
}
