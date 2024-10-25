<?php

namespace App\Http\Controllers;

use App\Models\DynamicPage;
use App\Http\Requests\StoreDynamicPageRequest;
use App\Http\Requests\UpdateDynamicPageRequest;
use App\Models\Products\ProductCategory;
use Inertia\Inertia;

class DynamicPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Pages/PageList", [
            "pages" => DynamicPage::all(["id", "title", "slug", "created_at", "updated_at"]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("System/Pages/Page", [
            "menu" => ProductCategory::query()->where("show_in_menu", true)->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDynamicPageRequest $request)
    {
        $data = [];
        $data["title"] = $request->root["props"]["title"];
        if (isset($request->root["props"]["slug"])) {
            $data["slug"] = $request->root["props"]["slug"];
        }
        $data["content"] = $request->content;

        $page = DynamicPage::create($data);
        return redirect()->route('system.pages.page.edit', $page->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(DynamicPage $dynamicPage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DynamicPage $dynamicPage)
    {
        return Inertia::render("System/Pages/Page", [
            "menu" => ProductCategory::query()->where("show_in_menu", true)->get(),
            "page" => $dynamicPage
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDynamicPageRequest $request, DynamicPage $dynamicPage)
    {
//        dd($request->validated(), $dynamicPage);
        $dynamicPage->update([
            ...$request->validated(),
            "title" => $request->root["props"]["title"],
            "slug" => $request->root["props"]["slug"],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DynamicPage $dynamicPage)
    {
        $dynamicPage->delete();
    }

    public function link()
    {
        $links = collect([]);


        $other = [
            "name" => __("Other"),
            "links" => [
                [
                    "name" => __("Home page"),
                    "url" => route("b2b.main")
                ],
                [
                    "name" => __("Favorites"),
                    "url" => route("b2b.favorites")
                ],
                [
                    "name" => __("Cart"),
                    "url" => route("b2b.cart")
                ],
                [
                    "name" => __("Invoices"),
                    "url" => route("b2b.invoices")
                ],
                [
                    "name" => __("Orders"),
                    "url" => route("b2b.orders")
                ],
                [
                    "name" => __("Settlements"),
                    "url" => route("b2b.settlements")
                ],
                [
                    "name" => __("Client zone"),
                    "url" => route("b2b.client")
                ],
            ]
        ];
        $links->push($other);


        $pages = [
            "name" => "Pages",
            "links" => DynamicPage::all(["id", "title", "slug"])->map(function ($page) {
                return [
                    "name" => $page->title,
                    "url" => route("b2b.page", $page->slug)
                ];
            })
        ];
        $links->push($pages);

        $categories = [
            "name" => "Categories",
            "links" => ProductCategory::query()->where("show_in_menu", true)->get(["id", "name", "slug"])->map(function ($category) {
                return [
                    "name" => $category->name,
                    "url" => route("b2b.category", $category->slug)
                ];
            })
        ];
        $links->push($categories);

        return response()->json($links);
    }
}
