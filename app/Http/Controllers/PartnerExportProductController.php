<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchProductRequest;
use App\Models\Partner;
use App\Models\Products\Product;
use Illuminate\Http\Request;

class PartnerExportProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function search(SearchProductRequest $request)
    {
        $products = Product::query()
            ->Where('id', 'LIKE', '%' . $request->search . '%')
            ->orWhere("name", "LIKE", "%" . $request->search . "%")
            ->orWhere("symbol", "LIKE", "%" . $request->search . "%")
            ->limit(35)
            ->get(["id", "symbol", "name", "product_model_color_id"])->map(function ($product) {
                $product->mainImage = $product->images()->where("type", 1)->where("order", 0)->first();
                return $product;
            });
        return response()->json($products);
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
    public function store(Request $request, Partner $partner, Product $product)
    {
        $partner->products()->syncWithoutDetaching($product->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner, Product $product)
    {
        $partner->products()->detach($product->id);
    }
}
