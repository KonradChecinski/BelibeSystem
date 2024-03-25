<?php

namespace App\Http\Controllers\System\Queries;

use App\Http\Controllers\Controller;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueryImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = ProductImage::with(["color:id,name,shortcut", "model:symbol"])->get();
//            ->map(function ($image) {
//                return [
//                    'created_at' => $image->created_at,
//                    'updated_at' => $image->updated_at,
//
//                    'height' => $image->height,
//                    'width' => $image->width,
//
//                    'main' => $image->main,
//                    'order' => $image->order,
//                    'type' => $image->type,
//                    'publish' => $image->publish,
//
//                    'path' => $image->path,
//
//                    'color_symbol' => $image->color->shortcut,
//                    'color_name' => $image->color->name,
//                    'model_symbol' => $image->model->symbol,
//                ];
//            });


        return Inertia::render('System/Queries/QueryImages', [
            'images' => $images,
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
    public function store(Request $request)
    {
        //
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
    public function destroy(string $id)
    {
        //
    }
}
