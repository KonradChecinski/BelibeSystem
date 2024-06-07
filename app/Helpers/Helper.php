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
            return Arr::first(session("client"))->id;
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
            if (!is_null($client)) {
                return $client;
            }
//            return to_route("system.dashboard");
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


    public static function getCartSummary($cart = null): array
    {
        if ($cart === null) {
            $cart = self::getClientToB2b()->cart()->with("productModel");
        }

        return [
            "products" => $cart->sum("quantity"),
            "models" => $cart->get()->pluck("productModel")->flatten()->unique("id")->count(),
        ];
    }

    public static function sortByProductShortcut($a, $b)
    {
        if (is_numeric($a->shortcut) && is_numeric($b->shortcut)) {
            return ((float)($a->shortcut) > (float)($b->shortcut)) ? 1 : (((float)($b->shortcut) > (float)($a->shortcut)) ? -1 : 0);
        }

        if ($a->shortcut === 'M' || $a->shortcut === 'm') return 1;
        if ($b->shortcut === 'M' || $b->shortcut === 'm') return -1;

        return ($a->shortcut > $b->shortcut) ? 1 : (($b->shortcut > $a->shortcut) ? -1 : 0);

    }

    public static function sortByProductSize($a, $b)
    {
        $ORDER = ["one size", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl",
            "5xl", "6xl", "7xl", "8xl", "9xl", "10xl", "1", "2", "3"];

        $a = strtolower(trim($a->product->size->name));
        $b = strtolower(trim($b->product->size->name));

        $nra = null;
        $nrb = null;

        if (is_numeric($a)) {
            $nra = (int)$a;
            if ((in_array($a, $ORDER))) $nra = null;
        }
        if (is_numeric($b)) {
            $nrb = (int)$b;
            if ((in_array($b, $ORDER))) $nrb = null;
        }
        if ($nra || $nrb) {
            if ($nrb === 0) return 1;
            if (($nra && !$nrb) || $nra === 0) return -1;
            if (!$nra && $nrb) return 1;
            if ($nra && $nrb) {
                if ($nra == $nrb) {
                    return strcmp(substr($a, strlen((string)$nra)), substr($b, strlen((string)$nrb)));
                }

                return $nra - $nrb;
            }
        }


        return array_search($a, $ORDER) - array_search($b, $ORDER);

    }

}
