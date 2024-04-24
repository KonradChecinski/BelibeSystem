<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class Helper
{
    public static function getGuardFromDomain(Request $request): ?string
    {
        if (explode(".", $request->host())[0] === "b2b") {
            return "client";
        }
        if (explode(".", $request->host())[0] === "system") {
            return "user";
        }
        return null;
    }

    public static function getSystemNameFromDomain(Request $request): SystemName
    {
        // b2b or system
        if (explode(".", $request->host())[0] === "b2b") {
            return SystemName::B2B;
        }
        if (explode(".", $request->host())[0] === "system") {
            return SystemName::SYSTEM;
        }
        return SystemName::OTHER;
    }

    public static function getUserFromGuard()
    {
        $guard = auth()->guard();
        if ($guard->check()) {
            return $guard->user();
        }
        return null;
    }

    public static function getClientIdToB2b()
    {
        $guardName = auth()->guard()->name;
        if ($guardName === "client") {
            return auth()->user()->client_id;
        }
        if ($guardName === "user") {
            $clientId = Arr::first(session("client"))->id;
            if ($clientId) {
                return $clientId;
            }
            return redirect()->route("system.dashboard");
        }
        return null;
    }

    public static function getClientToB2b()
    {
        $guardName = auth()->guard()->name;
        if ($guardName === "client") {
            return auth()->user()->client;
        }
        if ($guardName === "user") {
            $client = Arr::first(session("client"));
            if ($client) {
                return $client;
            }
            return redirect()->route("system.dashboard");
        }
        return null;
    }

    public static function getBackgroundImage(): string
    {
        $backgrounds = [
            "background_1.jpg",
            "background_2.jpg",
            "background_3.jpg",
            "background_4.jpg",
            "background_5.jpg",
            "background_6.jpg",
            "background_7.jpg",
            "background_8.jpg",
            "background_9.jpg",
            "background_10.jpg",
            "background_11.jpg",
            "background_12.jpg",
            "background_13.jpg",
            "background_14.jpg",
            "background_15.jpg",
        ];
        return route("storage", ["path" => "backgrounds>" . $backgrounds[array_rand($backgrounds)]]);
    }
}
