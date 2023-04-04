<?php

namespace App\Helpers;

use Illuminate\Http\Request;

class Helper
{
    public static function getGuardFromDomain(Request $request): ?string
    {
        if (explode(".", $request->host())[0] == "b2b") {
            return "client";
        }
        if (explode(".", $request->host())[0] == "system") {
            return "user";
        }
        return null;
    }

    public static function getSystemNameFromDomain(Request $request): SystemName
    {
        // b2b or system
        if (explode(".", $request->host())[0] == "b2b") {
            return SystemName::B2B;
        }
        if (explode(".", $request->host())[0] == "system") {
            return SystemName::SYSTEM;
        }
        return SystemName::OTHER;
    }
}
