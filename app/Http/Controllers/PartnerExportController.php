<?php

namespace App\Http\Controllers;

use App\Jobs\partners\MakePartnerExportFile;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Http\Requests\StorePartnerExportRequest;
use App\Http\Requests\UpdatePartnerExportRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            $extension = $partner->type === 1 ? 'xml' : 'xlsx';
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
    public function edit(PartnerExport $partnerExport)
    {
        //
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
            MakePartnerExportFile::dispatchSync($partner, $export);
            return redirect()->back();
        }

        return redirect()->back()->withErrors(["error" => "Nie znaleziono eksportu dla partnera"]);

    }
}
