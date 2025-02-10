<?php

namespace App\Helpers;

use App\Models\DynamicPage;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

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
            $client = session("client");
            return $client->id;
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
            $client = session("client");
            if (!is_null($client)) {
                return $client;
            }
//            return to_route("system.dashboard");
        }
        return null;
    }

    public static function isOrderToEdit()
    {
        $guardName = auth()->guard()->name;

        if ($guardName === "user") {
            $client = session("client");
            $clientOrder = session("clientOrderToEdit");
            if (!is_null($client) && !is_null($clientOrder)) {
                return true;
            }
        }
        return false;
    }

    public static function getClientOrderToEditToB2b()
    {
        $guardName = auth()->guard()->name;
        if ($guardName === "user") {
            $client = session("client");
            $clientOrder = session("clientOrderToEdit");
            if (!is_null($client) && !is_null($clientOrder)) {
                return $clientOrder;
            }
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
            if (!self::isOrderToEdit()) {
                $cart = self::getClientToB2b()->cart()->with("productModel");
            } else {
                $cart = self::getClientOrderToEditToB2b()->orderProducts()->with("productModel");
            }
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

//    public static function calculateProcessingTime(string $orderPlacedTime)
//    {
//        // Ustawienie strefy czasowej
//        Carbon::setLocale('pl');
////        date_default_timezone_set('Europe/Warsaw');
//
//        // Konwersja stringa na obiekt Carbon
//        $orderDate = Carbon::parse($orderPlacedTime)->timezone('Europe/Warsaw');
//
//        // Godziny pracy firmy
//        $workStartHour = 8;
//        $workEndHour = 12;
//
//        // Jeśli zamówienie złożone w weekend, przesunięcie na poniedziałek 8:00
//        if ($orderDate->isWeekend()) {
//            $orderDate->next(Carbon::MONDAY)->setTime($workStartHour, 0);
//        } elseif ($orderDate->hour < $workStartHour) {
//            // Jeśli zamówienie złożone przed rozpoczęciem pracy, ustaw na ten dzień 8:00
//            $orderDate->setTime($workStartHour, 0);
//        } elseif ($orderDate->hour >= $workEndHour) {
//            // Jeśli zamówienie złożone po godzinach pracy, przesunięcie na następny dzień roboczy 8:00
//            $orderDate->addDay()->setTime($workStartHour, 0);
//            if ($orderDate->isWeekend()) {
//                $orderDate->next(Carbon::MONDAY)->setTime($workStartHour, 0);
//            }
//        }
//
//        // Obliczanie liczby dni roboczych do momentu obsługi zamówienia
//        $processingDays = 0;
//        while ($orderDate->isWeekday() && $orderDate->lessThan(Carbon::now())) {
//            $processingDays++;
//            $orderDate->addDay();
//            if ($orderDate->isWeekend()) {
//                $orderDate->next(Carbon::MONDAY);
//            }
//        }
//
//        // Dodanie jednego dnia roboczego, jeśli przetwarzanie nie rozpoczęło się tego samego dnia
//        if ($orderDate->greaterThan(Carbon::now()->setTime($workStartHour, 0))) {
//            $processingDays++;
//        }
//
//        return $processingDays;
//    }

    public static function calculateProcessingTime(Carbon $orderDate)
    {
        // Company working hours settings
        $workingHoursFrom = 8;
        $workingHoursTo = 12;
        $workingDays = [Carbon::MONDAY, Carbon::TUESDAY, Carbon::WEDNESDAY, Carbon::THURSDAY, Carbon::FRIDAY];

        // Convert order date to Carbon object
//        $order = Carbon::parse($orderDate);
        $order = $orderDate;

        // Check if the order was placed during working hours
        if (in_array($order->dayOfWeek, $workingDays) &&
            $order->hour >= $workingHoursFrom &&
            $order->hour < $workingHoursTo) {
            // Order placed within working hours
            return 0;
        }

        // Find the next working day
        $nextWorkingDay = $order->copy();
        do {
            $nextWorkingDay->addDay();
        } while (!in_array($nextWorkingDay->dayOfWeek, $workingDays));

        // Calculate the difference in days
        $daysDifference = $nextWorkingDay->diffInDays($order);

        return $daysDifference;
    }

    public static function calculateDeliveryTime(Carbon $orderDate, $minDeliveryDays = 1, $maxDeliveryDays = 2)
    {
        // Company working days settings
        $workingDays = [Carbon::MONDAY, Carbon::TUESDAY, Carbon::WEDNESDAY, Carbon::THURSDAY, Carbon::FRIDAY];

        // Convert order date to Carbon object
        $order = Carbon::parse($orderDate);

        // Find the next working day if the order is placed on a non-working day
        if (!in_array($order->dayOfWeek, $workingDays)) {
            do {
                $order->addDay();
            } while (!in_array($order->dayOfWeek, $workingDays));
        }

        // Calculate the minimum delivery time (minDeliveryDays working days after order date)
        $minDeliveryDate = $order->copy();
        $minDeliveryCounter = 0;
        while ($minDeliveryCounter < $minDeliveryDays) {
            $minDeliveryDate->addDay();
            if (in_array($minDeliveryDate->dayOfWeek, $workingDays)) {
                $minDeliveryCounter++;
            }
        }

        // Calculate the maximum delivery time (maxDeliveryDays working days after order date)
        $maxDeliveryDate = $order->copy();
        $maxDeliveryCounter = 0;
        while ($maxDeliveryCounter < $maxDeliveryDays) {
            $maxDeliveryDate->addDay();
            if (in_array($maxDeliveryDate->dayOfWeek, $workingDays)) {
                $maxDeliveryCounter++;
            }
        }

        // Calculate the total delivery time in days from the order date
        $totalMinDeliveryTimeDays = $minDeliveryDate->diffInDays($order);
        $totalMaxDeliveryTimeDays = $maxDeliveryDate->diffInDays($order);

        return (object)[
            'min_delivery_time' => $totalMinDeliveryTimeDays,
            'max_delivery_time' => $totalMaxDeliveryTimeDays
        ];
    }


    /**
     * @return \Illuminate\Support\Collection
     */
    public static function getLinks(): \Illuminate\Support\Collection
    {
        $links = collect([]);


        $other = [
            "name" => __("Other"),
            "links" => [
                [
                    "name" => __("Home page"),
                    "route" => "b2b.main",
                    "parameters" => null
                ],
                [
                    "name" => __("Favorites"),
                    "route" => "b2b.favorites",
                    "parameters" => null
                ],
                [
                    "name" => __("Cart"),
                    "route" => "b2b.cart",
                    "parameters" => null
                ],
                [
                    "name" => __("Invoices"),
                    "route" => "b2b.invoices",
                    "parameters" => null
                ],
                [
                    "name" => __("Orders"),
                    "route" => "b2b.orders",
                    "parameters" => null
                ],
                [
                    "name" => __("Settlements"),
                    "route" => "b2b.settlements",
                    "parameters" => null
                ],
                [
                    "name" => __("Client zone"),
                    "route" => "b2b.client",
                    "parameters" => null
                ],
            ]
        ];
        $links->push($other);


        $pages = [
            "name" => "Pages",
            "links" => DynamicPage::all(["id", "title", "slug"])->map(function ($page) {
                return [
                    "name" => $page->title,
                    "route" => "b2b.page",
                    "parameters" => ["slug" => $page->slug]
                ];
            })
        ];
        $links->push($pages);

        $categories = [
            "name" => "Categories",
            "links" => ProductCategory::query()->where("show_in_menu", true)->get(["id", "name", "slug"])->map(function ($category) {
                return [
                    "name" => $category->name,
                    "route" => "b2b.category",
                    "parameters" => ["slug" => $category->slug]
                ];
            })
        ];
        $links->push($categories);
        return $links;
    }
}
