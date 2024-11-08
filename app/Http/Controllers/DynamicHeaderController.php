<?php

namespace App\Http\Controllers;

use App\Models\DynamicHeader;
use App\Http\Requests\StoreDynamicHeaderRequest;
use App\Http\Requests\UpdateDynamicHeaderRequest;
use Inertia\Inertia;

class DynamicHeaderController extends Controller
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
    public function store(StoreDynamicHeaderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DynamicHeader $dynamicHeader)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        $dynamicHeader = DynamicHeader::all();
//        dd($dynamicHeader);
        return Inertia::render('System/Pages/Header',
            [
                "dynamicHeader" => $dynamicHeader
            ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDynamicHeaderRequest $request, DynamicHeader $dynamicHeader)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DynamicHeader $dynamicHeader)
    {
        //
    }
}
