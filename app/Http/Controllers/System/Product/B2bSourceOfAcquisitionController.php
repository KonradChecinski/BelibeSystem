<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreB2bSourceOfAcquisitionRequest;
use App\Http\Requests\Client\UpdateB2bSourceOfAcquisitionRequest;
use App\Models\B2bSourceOfAcquisition;
use Inertia\Inertia;

class B2bSourceOfAcquisitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/B2B/Acquisition", [
            "acquisitions" => B2bSourceOfAcquisition::all(),
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
    public function store(StoreB2bSourceOfAcquisitionRequest $request)
    {
        B2bSourceOfAcquisition::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(B2bSourceOfAcquisition $b2bSourceOfAcquisition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2bSourceOfAcquisition $b2bSourceOfAcquisition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2bSourceOfAcquisitionRequest $request, B2bSourceOfAcquisition $b2bSourceOfAcquisition)
    {
        $b2bSourceOfAcquisition->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(B2bSourceOfAcquisition $b2bSourceOfAcquisition)
    {
        $b2bSourceOfAcquisition->delete();
    }
}
