<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bSettlementsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();
//        dd($client->receivables->toArray(), $client->obligations->toArray());
        $settlements = $client->receivables()->where("datetime", ">", now()->subYears(2))->get();
        return Inertia::render('B2B/Settlements', [
            "settlements" => $settlements->map(function ($item) {
                return $item
                    ->only([
                        "settlement",
                        "datetime",
                        "number",
                        "date_of_payment",
                        "date_of_last_payment",
                        "days_of_delay",
                        "original_value",
                        "value",
                    ]);
            }
            )
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
