<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateB2BProductModelRequest;
use App\Http\Requests\Product\UpdateB2CProductModelRequest;
use App\Jobs\Shoper\ShoperChangeDescription;
use App\Jobs\ToSubiekt\Towar\ChangeB2CInModelInSubiekt;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;

class B2CProductModelController extends Controller
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
    public function update(UpdateB2CProductModelRequest $request, ProductModel $productModel)
    {
        $productModel->update(["description_b2c" => $request->description_b2c, "b2c_variant" => $request->b2c_variant]);
        $productModel->b2cCategory()->associate($request->product_b2c_category_id);
        $productModel->save();
        ChangeB2CInModelInSubiekt::dispatch($productModel);
        ShoperChangeDescription::dispatch($productModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
