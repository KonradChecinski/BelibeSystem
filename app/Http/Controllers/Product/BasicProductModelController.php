<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateBasicProductModelRequest;
use App\Jobs\ToSubiekt\ChangeBasicInModelInSubiekt;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;

class BasicProductModelController extends Controller
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
    public function update(UpdateBasicProductModelRequest $request, ProductModel $productModel)
    {
        $productModel->update($request->all());
        $productModel->group()->associate($request->product_group_id);
        $productModel->save();
        ChangeBasicInModelInSubiekt::dispatch($productModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
