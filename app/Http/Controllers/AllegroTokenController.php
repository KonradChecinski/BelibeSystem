<?php

namespace App\Http\Controllers;

use App\Helpers\Allegro\AllegroLogin;
use App\Models\AllegroToken;
use App\Http\Requests\StoreAllegroTokenRequest;
use App\Http\Requests\UpdateAllegroTokenRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllegroTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Allegro/Status", [
            'allegroToken' => AllegroToken::query()->latest()->first()->only(["id", "created_at", "updated_at", "expires_at"]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $code_verifier = AllegroLogin::generateCodeVerifier();
        session()->put("code_verifier", $code_verifier);

        return Inertia::render("System/Settings/Allegro/GetToken", [
            "client_id" => config('services.allegro.client_id'),
            "code_challenge" => AllegroLogin::generateCodeChallenge($code_verifier),
        ]);
    }

    public function token(Request $request)
    {
        while (($allegroTokenFlag = AllegroLogin::getToken($request->code)) === false) {
            sleep(1);
        }
        return redirect()->route("system.settings.allegro.status");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAllegroTokenRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AllegroToken $allegroToken)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AllegroToken $allegroToken)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAllegroTokenRequest $request, AllegroToken $allegroToken)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllegroToken $allegroToken)
    {
        //
    }
}
