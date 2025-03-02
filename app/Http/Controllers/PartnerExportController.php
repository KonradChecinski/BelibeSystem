<?php

namespace App\Http\Controllers;

use App\Jobs\partners\MakePartnerExportFile;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Http\Requests\StorePartnerExportRequest;
use App\Http\Requests\UpdatePartnerExportRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerExportController extends Controller
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
    public function store(StorePartnerExportRequest $request, Partner $partner)
    {
//        dd($request->all());
        $partner->partnerExports()->create([
            'type' => $request->type,
            'path' => Str::uuid(),
            'cron' => $request->cron,
//            'completed_at',
        ]);
    }

    /**
     * Display the specified resource. Dla niezalogowanych użytkowników
     */
    public function show(string $uuid)
    {
        $partner = PartnerExport::where('path', $uuid)->first();
        if ($partner) {
            $extension = "";
            switch ($partner->type) {
                case 1:
                    $extension = 'xml';
                    break;
                case 2:
                    $extension = 'xlsx';
                    break;
                case 3:
                    $extension = 'csv';
                    break;
            }

            $fileExist = Storage::exists("partners/{$partner->path}." . $extension);
            if ($fileExist) {
                return Storage::download("partners/{$partner->path}." . $extension);
            }
        }
        return abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partner $partner)
    {
        $products = $partner->products()
//            ->select(["id", "symbol", "name", "quantity"]) // Pobieramy tylko te kolumny, które są w bazie
            ->get()
            ->each->setAppends([]);

//        dd($products);
        return Inertia::render("System/Partners/PartnerExport", [
            "partner" => $partner,
            "products" => $products,
            "exports" => $partner->partnerExports,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerExportRequest $request, Partner $partner, PartnerExport $export)
    {
        $exists = $partner->partnerExports()->where('id', $export->id)->exists();
        if ($exists) {
            $export->update([
                'type' => $request->type,
                'cron' => $request->cron,
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner, PartnerExport $export)
    {
        $exists = $partner->partnerExports()->where('id', $export->id)->exists();
        if ($exists) {
            $export->delete();
        }
    }


    public function runUpdate(Partner $partner, PartnerExport $export)
    {
        $exists = $partner->partnerExports()->where('id', $export->id)->exists();
        if ($exists) {
            MakePartnerExportFile::dispatch($partner, $export);
            return redirect()->back();
        }

        return redirect()->back()->withErrors(["error" => "Nie znaleziono eksportu dla partnera"]);

    }
}
