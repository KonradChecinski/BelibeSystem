<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //        foreach (ProductModelColor::query()->whereNull("b2c_color_id")->get() as $productModelColor) {
//            $b2cColor = B2cColor::query()->where("name", $productModelColor->b2c_name)->first();
//            if (is_null($b2cColor)) continue;
//
//            $productModelColor->b2cColor()->associate($b2cColor);
//            $productModelColor->save();
////            dd($productModelColor, $b2cColor);
//        }
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
