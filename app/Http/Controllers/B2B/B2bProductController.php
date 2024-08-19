<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\SearchProductModelRequest;
use App\Models\Client\Client;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function search(SearchProductModelRequest $request)
    {
        $models = ProductModel::with(['barcodes:product_id,barcode'])
            ->whereHas("products", function ($query) {
                $query->where("show_in_b2b", true);
            })->where(function ($query) use ($request) {
                $query->where('id', 'LIKE', '%' . $request->search . '%')
                    ->orWhere("name", "LIKE", "%" . $request->search . "%")
                    ->orWhere("symbol", "LIKE", "%" . $request->search . "%")
                    ->orWhereHas("barcodes", function ($query) use ($request) {
                        $query->Where("barcode", "LIKE", "%" . $request->search . "%");
                    });
            })
            ->limit(15)
            ->get(["id", "symbol", "name", "slug"])->map(function ($model) {
                $model->mainImage = $model->mainImage();
                return $model;
            });
        return response()->json($models);
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
    public function show(string $slug)
    {
        $productModel = ProductModel::findBySlug($slug);
        if (!$productModel) {
            abort(404);
        }
        $productModel = $productModel->load([
            'prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency',
            "productsToB2bWithRelation",
            "sizesToB2b",
        ]);
        $client = Client::find(Helper::getClientIdToB2b());

//        dd($productModel, $productModel->productsToB2bWithRelation);
//        dd($productModel->toArray());
        return Inertia::render('B2B/Model',
            [
                "model" => [
                    'id' => $productModel->id,
                    'name' => $productModel->name,
                    'symbol' => $productModel->symbol,
                    'slug' => $productModel->slug,
                    'description_b2b' => $productModel->description_b2b,
                    'mainImages' => $productModel->mainImages() ? $productModel->mainImages()->map(fn($image) => ["path" => $image->path]) : null,
                    'price' => array_merge($productModel->prices->toArray(), $productModel->priceForClientB2b($client)),
//                    'quantity' => $productModel->quantityToB2b(),
                    'colors' => $productModel->productsToB2bWithRelation,
                    'sizes' => $productModel->sizesToB2b->map(fn($size) => [
                        "id" => $size->id,
                        "name" => $size->name
                    ])->unique()->values(),
                    'isFavorited' => $productModel->isFavoritedByClient($client),
                ],
                "cart" => $productModel->clientsCart($client)->get()
            ]
        );
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
