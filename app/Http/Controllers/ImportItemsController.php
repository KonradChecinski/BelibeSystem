<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Spatie\SimpleExcel\SimpleExcelReader;

class ImportItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("B2B/ImportItems", [

        ]);
    }

    /**
     * Get the header of the import file.
     */
    public function getHeaderFromFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv,txt',
        ]);
        $file = $request->file('file');
        $headers = Excel::toCollection(new HeadingRowImport, $file->getPathname());
        $collection = Excel::toCollection(null, $file->getPathname());
        $rows = $collection->first(); // arkusz nr 1
        $firstRow = $rows->skip(1)->first();
        $headers = $headers->first()[0];
        $filteredHeaders = $headers->filter(fn($value) => is_string($value))->values();
        return Inertia::render('B2B/ImportItems', [
            'headersFromFile' => $filteredHeaders,
            'firstRow' => $firstRow,
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
