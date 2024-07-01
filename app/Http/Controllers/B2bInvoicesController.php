<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\ClientInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class B2bInvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Helper::getClientToB2b();
        $invoices = $client->invoices()->with([
            "clientOrder:id,number"
        ])
            ->where("created_at", ">", Carbon::now()->subYear())->get();
//        dd($invoices);
        return Inertia::render('B2B/Invoices', [
            "invoices" => $invoices->map(function ($item) {
                return $item
                    ->only([
                        "id",
                        "datetime",
                        "type",
                        "number",
                        "clientOrder",
                        "net_value",
                        "gross_value",
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
    public function show(Request $request, ClientInvoice $invoice)
    {
        $clientId = Helper::getClientIdToB2b();
        if ($invoice->client_id !== $clientId) {
            abort(403);
        }

        $pdf = Storage::get($invoice->path);
        $mimeType = Storage::mimeType($invoice->path);
        return response($pdf)->header('Content-Type', $mimeType);
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
