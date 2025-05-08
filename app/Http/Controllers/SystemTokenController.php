<?php

namespace App\Http\Controllers;

use App\Models\SystemToken;
use App\Http\Requests\StoreSystemTokenRequest;
use App\Http\Requests\UpdateSystemTokenRequest;
use DragonCode\Support\Facades\Helpers\Str;
use Inertia\Inertia;

class SystemTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('System/Settings/UsersAndPermissions/Tokens', [
            'tokens' => SystemToken::all(),
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
    public function store(StoreSystemTokenRequest $request)
    {
        $plainToken = Str::random(60);
        $hashedToken = hash('sha256', $plainToken);

        SystemToken::create([
            'name' => $request->name,
            'token' => $hashedToken,
        ]);

        return Inertia::render('System/Settings/UsersAndPermissions/Tokens', [
            'tokens' => SystemToken::all(),
            'newToken' => $plainToken,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(SystemToken $systemToken)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SystemToken $systemToken)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSystemTokenRequest $request, SystemToken $systemToken)
    {
        $plainToken = Str::random(60);
        $hashedToken = hash('sha256', $plainToken);

        $systemToken->update([
            'name' => $request->name,
            'token' => $hashedToken,
        ]);

        return Inertia::render('System/Settings/UsersAndPermissions/Tokens', [
            'tokens' => SystemToken::all(),
            'newToken' => $plainToken,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemToken $systemToken)
    {
        $systemToken->delete();
    }
}
