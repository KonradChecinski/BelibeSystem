<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductImageOrderRequest;
use App\Http\Requests\Product\UpdateProductImagePublishRequest;
use App\Models\ProductImageOrder;
use App\Models\Products\ProductImage;

class ProductImagePublishController extends Controller
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
    public function update(UpdateProductImagePublishRequest $request, ProductImage $productImage)
    {
        $productImage->publish = $request->publish;
        if ($productImage->type === 1) {
            foreach ($productImage->color->model->images as $image) {
                if ($image->main == $request->main) {
                    $image->main = 0;
                    $image->save();
                }
            }
            $productImage->main = $request->main;
        }


        $productImage->save();

//        AddImagesToSubiekt::dispatch($productImage->color->model);
//        ShoperChangeImages::dispatch($productImage->color);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $productImageOrder)
    {
        //
    }
}
