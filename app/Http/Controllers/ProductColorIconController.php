<?php

namespace App\Http\Controllers;

use App\Models\ProductColorIcon;
use App\Http\Requests\StoreProductColorIconRequest;
use App\Http\Requests\UpdateProductColorIconRequest;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductColorIconController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Models/ColorIcon", [
            'productColors' => ProductColorIcon::withCount(["colors"])
                ->with(["colorsWithModels"])
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductColorIconRequest $request)
    {
        ProductColorIcon::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductColorIcon $productColorIcon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductColorIcon $productColorIcon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductColorIconRequest $request)
    {

        $productIcon = ProductColorIcon::find($request->validated()['id']);
        $productIcon->update($request->validated());
        if ((int)$request->validated()["type"] === 1 && isset($request->validated()['files'])) {
            foreach ($request->validated()['files'] as $id => $file) {
                $pathImage = Storage::putFileAs("colors/", $file, uniqid('', true) . "." . $file->getClientOriginalExtension());
                $productIcon->path = str_replace('/', '\\', substr($pathImage, 7));
                $productIcon->save();
            }
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductColorIcon $productColorIcon)
    {
        if ($productColorIcon->colors()->count() != 0) {
            return redirect()->back()->withErrors([
                'error' => 'Nie można usunąć koloru, ponieważ jest przypisany do modeli produktów'
            ]);
        }
        $productColorIcon->delete();
    }
}
