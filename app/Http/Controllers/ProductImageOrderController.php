<?php

namespace App\Http\Controllers;

use App\Models\ProductImageOrder;
use App\Http\Requests\StoreProductImageOrderRequest;
use App\Http\Requests\UpdateProductImageOrderRequest;
use App\Models\Products\ProductModel;

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
        dd($request->all(), $productModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $productImageOrder)
    {
        //
    }
}
