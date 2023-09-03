<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductModelRequest;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Products\Product;
use App\Models\Products\ProductModelColor;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreProductRequest $request, ProductModelColor $modelColor)
    {
//        dd($request, $modelColor);
        $product = new Product($request->all());
        $modelColor->products()->save($product);
        dd($product);
//        $modelColor->products()->create([$request->all()]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductRequest $request, Product $product)
    {
        $deleteColorModel = $product->color->products()->count()==1 ? true : false;

        $product->delete();

        if($deleteColorModel) $product->color->delete();
    }
}
