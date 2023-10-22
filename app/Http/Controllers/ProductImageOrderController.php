<?php

namespace App\Http\Controllers;

use App\Models\ProductImageOrder;
use App\Http\Requests\StoreProductImageOrderRequest;
use App\Http\Requests\UpdateProductImageOrderRequest;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;

class ProductImageOrderController extends Controller
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
    public function store(StoreProductImageOrderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $productImageOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $productImageOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductImageOrderRequest $request, ProductModel $productModel)
    {
        foreach ($request->all() as $item) {
            $productModelColor = ProductModelColor::find($item["id"]);
            foreach ($item['images'] as $type => $images) {
                foreach ($images as $id => $image) {
                    $productImage = ProductImage::find($image["id"]);
                    $productImage->order = $id;
//                    $productImage->save();
                    $productModelColor->images()->save($productImage);
                }

            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $productImageOrder)
    {
        //
    }
}
