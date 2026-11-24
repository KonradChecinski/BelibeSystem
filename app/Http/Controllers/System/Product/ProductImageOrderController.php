<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductImageOrderRequest;
use App\Http\Requests\Product\UpdateProductImageOrderRequest;
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\TikTok\TikTokChangePrice;
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
            $productModelColor = ProductModelColor::with('model')->find($item["id"]);
            if (!$productModelColor) {
                continue;
            }

            foreach ($item['images'] as $type => $images) {
                foreach ($images as $id => $image) {
                    $productImage = ProductImage::find($image["id"]);
                    if (!$productImage) {
                        continue;
                    }

                    $oldType = (int) $productImage->type;
                    $oldColorId = (int) $productImage->product_model_color_id;
                    $newType = (int) $type;
                    $newColorId = (int) $productModelColor->id;

                    if ($productImage->order != $id ||
                        $oldColorId !== $newColorId ||
                        $oldType !== $newType
                    ) {
                        $oldColor = ($oldColorId !== $newColorId) ? $productImage->color : null;

                        $productImage->order = $id;
                        $productImage->type = $newType;

                        // If moved between colors or image types, move the physical file on disk as well
                        if ($oldColorId !== $newColorId || $oldType !== $newType) {
                            $productImage->syncPhysicalFileLocation($productModelColor, $newType);
                        }

                        $productModelColor->images()->save($productImage);

                        if ($newType === 1 || $oldType === 1) {
                            $changedColors->add($productModelColor);
                            if ($oldColor) {
                                $changedColors->add($oldColor);
                            }
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

        if ($changedColorsUnique->isNotEmpty()) {
            TikTokChangePrice::dispatch($productModel);
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
