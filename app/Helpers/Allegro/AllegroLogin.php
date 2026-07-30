<?php

namespace App\Helpers\Allegro;

use App\Models\AllegroToken;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class AllegroLogin
{
    public static function generateCodeVerifier()
    {
        $verifier_bytes = random_bytes(80);
        return rtrim(strtr(base64_encode($verifier_bytes), "+/", "-_"), "=");
    }

    public static function generateCodeChallenge($code_verifier)
    {
        $challenge_bytes = hash("sha256", $code_verifier, true);
        return rtrim(strtr(base64_encode($challenge_bytes), "+/", "-_"), "=");
    }

    public static function getToken(string $code): bool
    {
        $response = Http::withoutVerifying()
            ->asForm()->post(config("services.allegro.uri") . "/auth/oauth/token", [
                "grant_type" => "authorization_code",
                "code" => $code,
                "redirect_uri" => route("system.settings.allegro.token"),
                "code_verifier" => session()->pull("code_verifier"),
                "client_id" => config("services.allegro.client_id"),
            ]);
//        dd($response->status(), $response->json());

        if ($response->status() !== 200) {
            return false;
        }
        $json = $response->json();
        AllegroToken::create(array_merge($json, ["expires_at" => Carbon::now()->addSeconds($json["expires_in"])]));
        return true;
    }

    public static function refreshToken(AllegroToken $allegroToken): bool
    {
        $response = Http::withoutVerifying()
            ->asForm()
            ->withBasicAuth(
                config('services.allegro.client_id'),
                config('services.allegro.client_secret')
            )
//            ->withUserAgent(config("services.allegro.application_name") . "/" . config("services.allegro.application_version") . " (+" . route("system.allegro.info") . ")")
            ->post(config("services.allegro.uri") . "/auth/oauth/token", [
                "grant_type" => "refresh_token",
                "refresh_token" => $allegroToken->refresh_token,
            ]);
//        dd($response->status(), $response->json());

        if ($response->status() !== 200) {
            return false;
        }
        $json = $response->json();
        $allegroToken->update(array_merge($json, ["expires_at" => Carbon::now()->addSeconds($json["expires_in"])]));
        return true;
    }
}
