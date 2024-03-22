<?php

namespace App\Http\Controllers;

use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bProductCategoryController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = ProductCategory::findBySlug($slug);
        if (!$category) {
            abort(404);
        }
        $products = $category->productModels();

        return Inertia::render('B2B/Category', [
            'products' => $products->with(['mainImage:path'])->get()->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'symbol' => $product->symbol,
                'mainImage' => $product->mainImage ? ["path" => $product->mainImage->path] : null,
            ]
            )
        ]);
    }

}
