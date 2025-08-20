<?php

namespace App\Http\Controllers;

use App\Helpers\Warehouse\Warehouse;
use App\Http\Requests\UpdateWarehouseLocationMainRequest;
use App\Models\Products\ProductModel;
use App\Models\WarehouseLocation;
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
        $sizes = $productModel->sizes->unique('id');
        $sizes = Warehouse::sortSizes($sizes);

        $colors = $productModel->colors->unique('id')->sortBy('shortcut');
        $colors->load([
            "images" => function ($query) {
                $query->where('type', 1);
                $query->where('order', 0);
            },
            "colorIcon"
        ]);

        $fontSizeSize = 0;
        switch (true) {
            case count($sizes) < 7:
                $fontSizeSize = 46;
                break;
            case count($sizes) >= 7 && count($sizes) < 10:
                $fontSizeSize = 40;
                break;
            default:
                $fontSizeSize = 25;
                break;
        }


        $result = [
            'productModel' => $productModel,
            'sizes' => $sizes,
            'colors' => $colors,
            'fontSizeSize' => $fontSizeSize,
        ];
//        dd($sizes->toArray());
//        return view('pdf.system.model.warehouseLabel', $result);
        $pdf = Pdf::loadView('pdf.system.model.warehouseLabel', $result);
        $pdf->setPaper('A5', 'landscape');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('defaultFont', 'DejaVu Sans');
        return $pdf->stream("Label - " . $productModel->symbol . '.pdf');
    }


    public function printLabelForShelf(int $start = 1)
    {


        $result = [
            "start" => $start,
            "pointPerInch" => 72,// point
            "cmPerInch" => 2.54,// cm
        ];

//        return view('pdf.system.model.warehouseLabelShelf', $result);
        $pdf = Pdf::loadView('pdf.system.model.warehouseLabelShelf', $result);
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        return $pdf->stream("Label - .pdf");
    }
}
