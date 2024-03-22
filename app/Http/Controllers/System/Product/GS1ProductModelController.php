<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateGS1ProductModelRequest;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;

class GS1ProductModelController extends Controller
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
    public function update(UpdateGS1ProductModelRequest $request, ProductModel $productModel)
    {
        $productModel->gs1Brand()->associate($request->product_gs1_brand_id);
        $productModel->gs1Gpc()->associate($request->product_gs1_gpc_id);
        $productModel->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
