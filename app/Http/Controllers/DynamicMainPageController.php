<?php

namespace App\Http\Controllers;

use App\Models\DynamicMainPage;
use App\Http\Requests\StoreDynamicMainPageRequest;
use App\Http\Requests\UpdateDynamicMainPageRequest;
use Inertia\Inertia;

class DynamicMainPageController extends Controller
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
    public function store(StoreDynamicMainPageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DynamicMainPage $dynamicMainPage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        $dynamicMainPage = DynamicMainPage::first();
        return Inertia::render('System/Pages/MainPage', [
            'dynamicMainPage' => $dynamicMainPage
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDynamicMainPageRequest $request)
    {
        $dynamicMainPage = DynamicMainPage::first();
        if (is_null($dynamicMainPage)) {
            $dynamicMainPage = new DynamicMainPage();
        }
        $dynamicMainPage->fill($request->validated());
        $dynamicMainPage->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DynamicMainPage $dynamicMainPage)
    {
        //
    }
}
