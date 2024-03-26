<?php

namespace App\Helpers;

use Illuminate\Http\Request;

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
