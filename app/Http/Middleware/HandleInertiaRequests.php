<?php

namespace App\Http\Middleware;

use App\Helpers\Helper;
use App\Helpers\SystemName;
use App\Models\DynamicFooter;
use App\Models\DynamicHeader;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = "app";

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $array = [];
        $array = array_merge(parent::share($request), $array);


        if (Session::exists("backgroundImage")) {
            $backgroud = Session::get("backgroundImage");
        } else {
            $backgroud = Helper::getBackgroundImage();
            Session::put("backgroundImage", $backgroud);
        }

        $client = Helper::getClientToB2b();
        if (request()->routeIs('b2b.*') && !$request->routeIs("b2b.login") && !$request->routeIs("b2b.register") && !is_null($client)) {
            if (Helper::getSystemNameFromDomain($request) === SystemName::SYSTEM) {
                $array = array_merge($array, [
                    "client" => Helper::getClientToB2b(),
                    "accountManager" => true,
                ]);
            }

            $cart = $client->cart()->with("productModel");
            $array = array_merge($array, [
                "menu" => ProductCategory::query()->where("show_in_menu", true)->get(["id", "name", "slug", "parent", "order"]),
                "footer" => DynamicFooter::first(["content", "zones"]),
                "header" => DynamicHeader::all(["name", "url"]),
                "clientId" => Helper::getClientIdToB2b(),
                "blacklist" => Helper::getClientToB2b()->blacklist || is_null(Helper::getClientToB2b()->subiekt_id),
                "cartSummary" => Helper::getCartSummary($cart),
            ]);
        }

        if (Helper::getSystemNameFromDomain($request) === SystemName::SYSTEM) {
            $array = array_merge($array, [
                "auth" => [
                    "user" => $request->user(),
                    "roles" => $request->user()
                        ? $request->user()->roles->pluck("name")
                        : [],
                    "permissions" => $request->user()
                        ? $request
                            ->user()
                            ->getPermissionsViaRoles()
                            ->pluck("name")
                            ->merge($request->user()->permissions->pluck("name"))
                        : [],
                ],
            ]);
        }

        // Add the Ziggy route helper to the page (for use in Vue components

        $array = array_merge($array, [
            "ziggy" => function () use ($request) {
                return array_merge((new Ziggy())->toArray(), [
                    "location" => $request->url(),
                ]);
            },
            "backgroundImage" => $backgroud,
        ]);

        return $array;
    }
}
