<?php

namespace App\Http\Controllers;

use App\Models\ProductColorIcon;
use App\Http\Requests\StoreProductColorIconRequest;
use App\Http\Requests\UpdateProductColorIconRequest;
use Inertia\Inertia;

class ProductColorIconController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/ColorIcon", [
            'productColors' => ProductColorIcon::withCount(["colors"])
                ->with(["colors"])
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
//        dd($request->all(), $request->validated());
        foreach ($request->validated() as $item) {
            $productIcon = ProductColorIcon::find($item['id'])->update($item);
            if ((int)$item["type"] === 1) {
                dd($item);
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
