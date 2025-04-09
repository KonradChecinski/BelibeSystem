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
//        $collection = Excel::toCollection(null, $file->getPathname());
//        $rows = $collection->first(); // arkusz nr 1
//        $firstRow = $rows->skip(1)->first();
        $headers = $headers->first()[0];
        $filteredHeaders = $headers->filter(fn($value) => is_string($value))->values();
        return Inertia::render('B2B/ImportItems', [
            'headersFromFile' => $filteredHeaders,
//            'firstRow' => $firstRow,
        ]);
    }

    /**
     * Get the items from the import file.
     */
    public function getItemsFromFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv,txt',
            'identification' => 'required|numeric|in:1,2',
            'selectedHeaders' => 'required|array',
            'selectedHeaders.symbol' => 'required_if:identification,1|string',
            'selectedHeaders.ean' => 'required_if:identification,2|string',
            'selectedHeaders.quantity' => 'required|string',
        ]);
        $file = $request->file('file');

        $selectedHeaders = $request->selectedHeaders;
        $identification = $request->identification;


        $selectedHeaders2 = [];
        if ($identification == 1) {
            $selectedHeaders2 = [
                'symbol' => $selectedHeaders['symbol'],
                'quantity' => $selectedHeaders['quantity'],
            ];
        } elseif ($identification == 2) {
            $selectedHeaders2 = [
                'ean' => $selectedHeaders['ean'],
                'quantity' => $selectedHeaders['quantity'],
            ];
        }
//        dd($selectedHeaders2);


        $collection = Excel::toCollection(null, $file->getPathname());

        // Pobieramy pierwszą stronę (sheet)
        $sheet = $collection->first();

        // Przekształcamy dane tak, by pierwszy wiersz był nagłówkiem
        $headers = $sheet->first()->toArray(); // np. ['nazwa', 'cena']
        $dataRows = $sheet->slice(1); // reszta danych

        $finalData = $dataRows->map(function ($row) use ($headers) {
            return collect($headers)->combine($row);
        });
        dd($finalData);

        return Inertia::render('B2B/ImportItems', [
            'itemsFromFile' => $items,
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
