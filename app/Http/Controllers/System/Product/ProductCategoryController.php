<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductCategoryRequest;
use App\Http\Requests\Product\UpdateProductCategoryRequest;
use App\Models\Products\ProductCategory;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Category", [
            'categories' => ProductCategory::withCount(["productModels", "clientsDiscounts"])
                ->with(["productModels:id,symbol,name", "clientsDiscounts:id,product_category_id,client_id,value", "clientsDiscounts.client:id,name,nip"])
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
    public function store(StoreProductCategoryRequest $request)
    {
        $productCategory = ProductCategory::create($request->validated());
        $productCategory->slug = "";
        $productCategory->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request)
    {
        foreach ($request->validated() as $item) {
            ProductCategory::find($item['id'])->update($item);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
        if ($productCategory->productModels->count() != 0 || $productCategory->clientsDiscounts->count() != 0) {
            return redirect()->back()->withErrors([
                'error' => 'Nie można usunąć kategorii, ponieważ jest przypisana do modeli produktów lub klientów'
            ]);
        }
        $productCategory->delete();
    }
}
