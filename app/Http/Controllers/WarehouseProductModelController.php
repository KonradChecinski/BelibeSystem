<?php

namespace App\Http\Controllers;

use App\Models\Products\ProductModel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class WarehouseProductModelController extends Controller
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


    public function print(ProductModel $productModel)
    {
//        dd($productModel);
        $result = [
            'productModel' => $productModel,
            'sizes' => $productModel->sizes->unique('id'),
            'colors' => $productModel->colorsWithImages,
        ];
//        dd($result);
        return view('pdf.system.model.warehouseLabel', $result);
        $pdf = Pdf::loadView('pdf.system.model.warehouseLabel', $result);
        $pdf->setPaper('A5', 'landscape');
        return $pdf->stream("Label - " . $productModel->symbol . '.pdf');
    }
}
