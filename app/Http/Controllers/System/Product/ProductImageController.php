<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductImageRequest;
use App\Http\Requests\Product\UpdateProductImageRequest;
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\ToSubiekt\Images\AddImagesToSubiekt;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModelColor;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProductImageController extends Controller
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
    public function store(StoreProductImageRequest $request, ProductModelColor $modelColor)
    {
        $type = $request->type["id"];
        $numberOfImages = $modelColor->images()->where('type', $type)->count();
        $model = $modelColor->model;
        $path = "images/" . $model->symbol . "/" . $modelColor->shortcut . "/" . $type . "/";
        foreach ($request->allFiles()['files'] as $id => $file) {
            $pathImage = Storage::putFileAs($path, $file, uniqid() . "." . $file->getClientOriginalExtension());
            $image = Image::make($file);
            if ($pathImage) {
                $image = new ProductImage([
                    'order' => $numberOfImages + $id,
                    'path' => str_replace('/', '\\', substr($pathImage, 7)),
                    'width' => $image->width(),
                    'height' => $image->height(),
                    'type' => $type,
                    'publish' => false,
                ]);
                $modelColor->images()->save($image);
            }

        }
        if ($type === 1) {
            AddImagesToSubiekt::dispatch($modelColor);
            ShoperChangeImages::dispatch($modelColor);
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $productImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $productImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductImageRequest $request, ProductImage $productImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $image)
    {
        if (auth()->user()->hasPermissionTo("deleteImages", "user")) {
            $modelColor = $image->color;
            $imageType = $image->type;
            $imageOrder = $image->order;
            $imagesToChangeOrder = $modelColor->images()->where('type', $imageType)->where('order', '>', $imageOrder)->orderBy('order')->get();
            $image->delete();
            foreach ($imagesToChangeOrder as $id => $imageToOrder) {
                $imageToOrder->order = $imageOrder + $id;
                $imageToOrder->save();
            }
            AddImagesToSubiekt::dispatch($image->color);


        } else {
            abort(403);
        }
    }
}
