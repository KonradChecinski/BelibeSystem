<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateShowProductRequest;
use App\Jobs\Shoper\ShoperChangeShow;
use App\Jobs\ToSubiekt\Towar\ChangeProductShowInSubiekt;
use App\Models\Products\Product;
use Illuminate\Http\Request;

class ShowProductController extends Controller
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
    public function update(UpdateShowProductRequest $request, Product $product)
    {
        $product->update($request->all());
        $product->save();
        if ($request->show_in_subiekt) ChangeProductShowInSubiekt::dispatch($product->id);
        if ($request->show_in_b2c) ShoperChangeShow::dispatch($product);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
