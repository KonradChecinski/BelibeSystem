<?php

namespace App\Http\Middleware;

use App\Helpers\Helper;
use App\Helpers\SystemName;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
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

        if (request()->routeIs('b2b.*') && !$request->routeIs("b2b.login") && !$request->routeIs("b2b.register")) {
            if (Helper::getSystemNameFromDomain($request) === SystemName::SYSTEM) {
                $array = array_merge($array, [
                    "client" => Helper::getClientToB2b(),
                    "accountManager" => true,
                ]);
            }

            $cart = Helper::getClientToB2b()->cart()->with("productModel");
            $array = array_merge($array, [
                "menu" => ProductCategory::query()->where("show_in_menu", true)->get(),
                "cartSummary" => [
                    "products" => $cart->sum("quantity"),
                    "models" => $cart->get()->pluck("productModel")->flatten()->unique("id")->count(),
                ]
            ]);
        }


        return array_merge($array, [
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
            "ziggy" => function () use ($request) {
                return array_merge((new Ziggy())->toArray(), [
                    "location" => $request->url(),
                ]);
            },
            "backgroundImage" => $backgroud,
//            'flash' => [
////                'type' => fn() => $request->session()->get("toast-type"),
////                'message' => fn() => $request->session()->get("toast-message")
//                'message' => fn() => $request->session()->get("toast")
//            ]
        ]);
    }
}
