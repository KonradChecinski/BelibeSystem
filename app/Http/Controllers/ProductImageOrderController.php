<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductImageOrderRequest;
use App\Http\Requests\Product\UpdateProductImageOrderRequest;
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\ToSubiekt\Images\AddImagesToSubiekt;
use App\Models\ProductImageOrder;
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
        $changedColors = collect();
        foreach ($request->all() as $item) {
            $productModelColor = ProductModelColor::find($item["id"]);

            foreach ($item['images'] as $type => $images) {
                foreach ($images as $id => $image) {
                    $productImage = ProductImage::find($image["id"]);
                    $oldType = $productImage->type;

//                    dd($productImage, $id, $productModelColor, $type, $oldType,
//                        $productImage->order != $id ||
//                        $productImage->product_model_color_id != $productModelColor->id ||
//                        $productImage->type != $type
//                    );

                    if ($productImage->order != $id ||
                        $productImage->product_model_color_id != $productModelColor->id ||
                        $productImage->type != $type
                    ) {
                        $productImage->order = $id;
                        $productImage->type = $type;
//                    $productImage->save();
                        $productModelColor->images()->save($productImage);
                        if ($type == 1) {
                            $changedColors->add($productModelColor);
                        }

                    }

                }

            }
        }
        $changedColorsUnique = $changedColors->unique("id");


        foreach ($changedColorsUnique as $productModelColor) {
            AddImagesToSubiekt::dispatch($productModelColor);
            ShoperChangeImages::dispatch($productModelColor);
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
