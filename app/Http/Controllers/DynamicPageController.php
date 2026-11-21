<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\DynamicHeader;
use App\Models\DynamicPage;
use App\Http\Requests\StoreDynamicPageRequest;
use App\Http\Requests\UpdateDynamicPageRequest;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
            "menu" => ProductCategory::query()->where("show_in_menu", true)->get(),
            "header" => DynamicHeader::all(["name", "url"]),
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
        $data["zones"] = $request->zones;

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
            "header" => DynamicHeader::all(["name", "order", "route", "parameters"]),
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
        $links = Helper::getLinks();

        return response()->json($links);
    }

    public function imagesList()
    {
        if (!Storage::exists('pages')) {
            Storage::makeDirectory('pages');
        }

        $files = Storage::files('pages');
        $images = [];

        foreach ($files as $file) {
            $filename = basename($file);
            $images[] = [
                'filename' => $filename,
                'url' => route('pageImages', ['path' => $filename]),
                'lastModified' => Storage::lastModified($file),
                'size' => Storage::size($file),
            ];
        }

        usort($images, fn($a, $b) => $b['lastModified'] <=> $a['lastModified']);

        return response()->json($images);
    }

    public function imageUpload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:20480',
        ]);

        $file = $request->file('image');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slugName = Str::slug($originalName) ?: 'image';
        $extension = $file->getClientOriginalExtension();
        $filename = $slugName . '-' . uniqid() . '.' . $extension;

        Storage::putFileAs('pages', $file, $filename);

        return response()->json([
            'filename' => $filename,
            'url' => route('pageImages', ['path' => $filename]),
        ]);
    }

    public function imageDelete(string $filename)
    {
        $cleanPath = 'pages/' . basename($filename);
        if (Storage::exists($cleanPath)) {
            Storage::delete($cleanPath);
        }

        return response()->json(['deleted' => true]);
    }
}
