<?php

namespace App\Http\Controllers;

use App\Models\DynamicFooter;
use App\Http\Requests\StoreDynamicFooterRequest;
use App\Http\Requests\UpdateDynamicFooterRequest;
use Inertia\Inertia;

class DynamicFooterController extends Controller
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
    public function store(StoreDynamicFooterRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DynamicFooter $dynamicFooter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
//        dd('edit');
        $dynamicFooter = DynamicFooter::first();
        return Inertia::render('System/Pages/Footer', [
            'dynamicFooter' => $dynamicFooter
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDynamicFooterRequest $request, DynamicFooter $dynamicFooter)
    {
        dd($request->all(), $dynamicFooter);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DynamicFooter $dynamicFooter)
    {
        //
    }
}
