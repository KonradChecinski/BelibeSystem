<?php

namespace App\Http\Controllers;

use App\Models\WarehouseDocument;
use App\Http\Requests\StoreWarehouseDocumentRequest;
use App\Http\Requests\UpdateWarehouseDocumentRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class WarehouseDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function currentDocuments()
    {
        return Inertia::render('System/Warehouse/DocumentList', [
            'warehouseDocuments' => WarehouseDocument::with(["clientOrder.client"])->whereIn('status', [10, 50])->get(),
        ]);
    }

    public function archivalDocuments()
    {
        return Inertia::render('System/Warehouse/DocumentList', [
            'warehouseDocuments' => WarehouseDocument::query()->where('status', 100)->get(),
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
    public function store(StoreWarehouseDocumentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseDocument $warehouseDocument)
    {
        //
    }

    public function print(WarehouseDocument $warehouseDocument)
    {
        $warehouseDocument->load([
            "warehouseDocumentProducts",
            "clientOrder",
            "clientOrder.client",
            "clientOrder.payment",
            "clientOrder.delivery",
            "clientOrder.location",
            "clientOrder.location.country:id,name",


            "products:products.id,products.symbol,products.quantity,products.product_size_id,products.product_unit_id,products.product_model_color_id",
            "products.size:id,name",
            "products.unit:id,name",
            "products.barcodes",
            "products.model",
            "products.color",
            "productModels:product_models.id,product_models.name,product_models.symbol",
//            "productModelColors" => function ($query) {
//                $query->select("product_model_colors.id",
//                    "product_model_colors.shortcut",
//                    "product_model_colors.name",
//                    "product_model_colors.product_model_id");
////                $query->withWhereHas("images", function ($query) {
////                    $query->where("type", 1);
////                    $query->where("order", 0);
////                    $query->select("product_model_color_id", "path");
////                });
//            },
        ]);
        $warehouseDocumentModel = collect([$warehouseDocument]);

        $result = [
            "warehouseDocument" => $warehouseDocument,
            "warehouseDocumentProducts" => $warehouseDocument->warehouseDocumentProducts,
            "products" => $warehouseDocumentModel->pluck("products")->flatten(),
            "productModels" => $warehouseDocumentModel->pluck("productModels")->flatten()->unique("id")->sortBy("symbol")->values(),
//            "productColors" => $warehouseDocumentModel->pluck("productModelColors")->flatten()->unique("id")->values(),
            "clientOrder" => $warehouseDocument->clientOrder,
            "client" => $warehouseDocument->clientOrder->client,
            "payment" => $warehouseDocument->clientOrder->payment,
            "delivery" => $warehouseDocument->clientOrder->delivery,
            "location" => $warehouseDocument->clientOrder->location,
        ];
//        dd($warehouseDocumentModel->toArray(), $result);
//        dd($result["products"]->toArray());

        $pdf = Pdf::loadView('pdf.system.warehouseDocument.warehouseDocument', $result);
        return $pdf->stream($warehouseDocument->number . '.pdf');

//        return view('pdf.system.warehouseDocument.warehouseDocument', $result);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseDocument $warehouseDocument)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseDocumentRequest $request, WarehouseDocument $warehouseDocument)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseDocument $warehouseDocument)
    {
        //
    }
}
