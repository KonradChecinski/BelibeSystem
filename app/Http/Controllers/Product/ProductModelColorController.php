<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductModelColorRequest;
use App\Http\Requests\Product\UpdateProductModelColorRequest;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;

class ProductModelColorController extends Controller
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
    public function store(StoreProductModelColorRequest $request, ProductModel $model)
    {
        $color = new ProductModelColor([
            "shortcut" => $request->shortcut,
            "name" => $request->name,
            "b2c_shortcut" => $request->b2c_shortcut,
            "b2c_product_name" => $request->b2c_product_name,
        ]);
        $color->b2cColor()->associate($request->b2c_name["id"]);
        $model->colors()->save($color);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductModelColor $productModelColor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductModelColor $productModelColor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductModelColorRequest $request, ProductModel $model, ProductModelColor $productModelColor)
    {
        $productModelColor->update([
//            "shortcut" => $request->shortcut,
            "name" => $request->name,
            "b2c_shortcut" => $request->b2c_shortcut,
            "b2c_product_name" => $request->b2c_product_name,
        ]);
        $productModelColor->b2cColor()->associate($request->b2c_name["id"]);
        $productModelColor->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductModelColor $productModelColor)
    {
        //
    }
}
