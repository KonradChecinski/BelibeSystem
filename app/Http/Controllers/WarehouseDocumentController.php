<?php

namespace App\Http\Controllers;

use App\Helpers\Prices\Price;
use App\Helpers\Warehouse\Warehouse;
use App\Http\Requests\SearchProductRequest;
use App\Jobs\ToSubiekt\ClientOrderCreateInSubiekt;
use App\Models\Products\Product;
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
        return Inertia::render('System/Warehouse/DocumentListArchive', [
            'warehouseDocuments' => WarehouseDocument::with(["clientOrder.client"])->whereIn('status', [0, 100])->get()
        ]);
    }

    public function search(SearchProductRequest $request, WarehouseDocument $warehouseDocument)
    {
//        dd($request->search, $warehouseDocument->clientOrder->client);

        $products = Product::query()
            ->Where("name", "LIKE", "%" . $request->search . "%")
            ->orWhere("symbol", "LIKE", "%" . $request->search . "%")
            ->limit(20)
            ->get(["id", "symbol", "name", "product_model_color_id", "product_size_id", "quantity"])->load(["color", "size"])->map(function ($product) use ($warehouseDocument) {
                $product->mainImage = $product->images()->where("type", 1)->where("order", 0)->first();
                $product->prices = Price::showClientPrices($product->model, $warehouseDocument->clientOrder->client);
                $product->availableWithoutThisDocument = $product->getAvailableQuantityWithoutWarehouseDocument($warehouseDocument->id);
                return $product;
            });
        return response()->json($products);
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
    public function store(StoreWarehouseDocumentRequest $request, WarehouseDocument $warehouseDocument)
    {
//        dd($request->validated(), $warehouseDocument, $warehouseDocument->user);
        $warehouseDocument->update([
            "status" => 100,
            "create_invoice" => $request->create_invoice,
        ]);
        $warehouseDocument->user()->associate(auth()->user());
        $warehouseDocument->save();
//        dd($request->validated(), $warehouseDocument, $warehouseDocument->user);

        $warehouseDocument->clientOrder()->update([
            "status" => 60,
        ]);

        ClientOrderCreateInSubiekt::dispatch($warehouseDocument->clientOrder);
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
        // Wyłączenie appendów dla każdego produktu
        $warehouseDocument->products->each->setAppends([]);

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

        if ($warehouseDocument->status === 10) {
            $warehouseDocument->status = 50;
            $warehouseDocument->save();

            $warehouseDocument->clientOrder()->update([
                "status" => 55
            ]);
        }


//        $pdf = Pdf::loadView('pdf.system.warehouseDocument.warehouseDocument', $result);
//        return $pdf->stream($warehouseDocument->number . '.pdf');
//        dd($result["products"]->toArray());
        return view('pdf.system.warehouseDocument.warehouseDocument', $result);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseDocument $warehouseDocument)
    {
        if ($warehouseDocument->status === 100) return response()->json(["message" => "Dokument jest zrealizowany"], 400);

        $warehouseDocument->load([
            "warehouseDocumentProducts",
            "warehouseDocumentProducts.product",
            "warehouseDocumentProducts.product.size",
            "warehouseDocumentProducts.product.color",
//            "warehouseDocumentProducts.product.model.prices",
            "productModels",
        ]);
        $warehouseDocument->warehouseDocumentProducts->map(function ($item) use ($warehouseDocument) {
            $item->product->availableWithoutThisDocument = $item->product->getAvailableQuantityWithoutWarehouseDocument($warehouseDocument->id);
            return $item;
        });
        $productModels = $warehouseDocument->productModels->unique()->sortBy("symbol")->values();

        $warehouseItems = collect();

        foreach ($productModels as $productModel) {
            $filteredProducts = $warehouseDocument->warehouseDocumentProducts->filter(function ($item) use ($productModel) {
                return $item->product->model->id === $productModel->id;
            });
            $sortedProducts = Warehouse::sortItemsBySizeAndColor($filteredProducts)->values();
            $warehouseItems->push(...$sortedProducts);
        }

//        dd($warehouseItems->toArray());
        $warehouseDocumentResult = [
            "id" => $warehouseDocument->id,
            "number" => $warehouseDocument->number,
            "status" => $warehouseDocument->status,
            "type" => $warehouseDocument->type,
            "client_order_id" => $warehouseDocument->client_order_id,
            "total_quantity" => $warehouseDocument->total_quantity,
            "total_net" => $warehouseDocument->total_net,
            "total_gross" => $warehouseDocument->total_gross,
            "discount" => $warehouseDocument->discount,
            "discounted_total_net" => $warehouseDocument->discounted_total_net,
            "discounted_total_gross" => $warehouseDocument->discounted_total_gross,
            "client_comment" => $warehouseDocument->client_comment,
            "user_comment" => $warehouseDocument->user_comment,
            "create_invoice" => $warehouseDocument->create_invoice,
            "created_at" => $warehouseDocument->created_at,
            "updated_at" => $warehouseDocument->updated_at,
            "warehouse_document_products" => $warehouseItems,
        ];
//        dd($warehouseDocumentResult);

        return Inertia::render('System/Warehouse/Document', [
            'warehouseDocument' => $warehouseDocumentResult
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseDocumentRequest $request, WarehouseDocument $warehouseDocument)
    {
        if ($warehouseDocument->status === 100) return response()->json(["message" => "Dokument jest zrealizowany"], 400);
        $warehouseDocumentProducts = $warehouseDocument->warehouseDocumentProducts;
        $warehouseDocumentProductsIds = $warehouseDocumentProducts->pluck("id");

        foreach ($request->validated() as $item) {
            if (in_array($item["id"], $warehouseDocumentProductsIds->toArray())) {

                $warehouseDocumentProducts->find($item["id"])->update([
                    "quantity" => $item["quantity"],
                ]);

                $warehouseDocumentProductsIds = $warehouseDocumentProductsIds->reject(function ($id) use ($item) {
                    return $id === $item["id"];
                });

            } else {
                $product = Product::find($item["product"]["id"]);
                $prices = (object)Price::showClientPrices($product->model, $warehouseDocument->clientOrder->client);

//                dd($product, $prices, [
//                    "original_price_net" => isset($prices->original_price_net) ? $prices->original_price_net : $prices->price_net,
//                    "original_price_gross" => isset($prices->original_price_gross) ? $prices->original_price_gross : $prices->price_gross,
//                    "price_net" => $prices->price_net,
//                    "price_gross" => $prices->price_gross,
//                    "currency" => $prices->currency,
//                ]);
                $warehouseDocument->warehouseDocumentProducts()->create([
                    "type" => 2,
                    "product_id" => $product->id,
                    "product_code" => null,
                    "quantity" => $item["quantity"],

                    "original_price_net" => isset($prices->original_price_net) ? $prices->original_price_net : $prices->price_net,
                    "original_price_gross" => isset($prices->original_price_gross) ? $prices->original_price_gross : $prices->price_gross,
                    "price_net" => $prices->price_net,
                    "price_gross" => $prices->price_gross,
                    "currency" => $prices->currency,
                    "vat_rate" => $prices->vat_rate,
                ]);
            }
        }
        if ($warehouseDocumentProductsIds->count() > 0) {
            foreach ($warehouseDocumentProducts->whereIn("id", $warehouseDocumentProductsIds) as $item) {
                $item->delete();
            }
        }

        $calculateTotalFromCartItems = Price::calculateTotalFromCartItems($warehouseDocumentProducts, (bool)$warehouseDocument->discount, $warehouseDocument->discount);

        $priceSummary = $calculateTotalFromCartItems->priceSummary;
        $discountedPriceSummary = $calculateTotalFromCartItems->discountedPriceSummary;
//        dd($priceSummary, $discountedPriceSummary);
        $warehouseDocument->update([
            "total_quantity" => $warehouseDocument->warehouseDocumentProducts->sum("quantity"),
            "total_net" => $priceSummary["total_net"],
            "total_gross" => $priceSummary["total_gross"],
            "discounted_total_net" => $discountedPriceSummary["total_net"],
            "discounted_total_gross" => $discountedPriceSummary["total_gross"],
        ]);


        return redirect()->route('system.warehouse.documents');
//        dd($request->validated(), $warehouseDocument, $warehouseDocumentProducts, $warehouseDocumentProductsIds);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseDocument $warehouseDocument)
    {
        //
    }
}
