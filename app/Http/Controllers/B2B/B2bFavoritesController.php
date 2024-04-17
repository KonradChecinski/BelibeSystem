<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\PriceForClient\PriceForClient;
use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bFavoritesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $client = Client::find(auth()->user()->client_id);
        $discounts = $client->discounts;

        $models = $client->favorites()
            ->whereHas("productsToB2bWithoutRelation", function ($query) {
//                $query->where("quantity", ">", 0);
                $query->where("show_in_b2b", true);
            })
            ->with([
                'prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency',
                'categories:id',
                'group:id',
                'brand:id',
                'productsToB2bWithoutRelation:quantity,product_model_id,product_size_id',
                'productsToB2bWithoutRelation.size',
//                'productsToB2bWithoutRelation:quantity,product_model_id',
//                'products.size',
                'colorIcons'
            ])
            ->paginate(24)
            ->through(function ($model) use ($discounts, $client) {
                $mainImages = $model->mainImages();
//                if ($model->symbol === "S-0100-0104") dd($model->productsToB2bWithoutRelation);
//                dd($model);
                return [
                    'id' => $model->id,
                    'name' => $model->name,
                    'symbol' => $model->symbol,
                    'slug' => $model->slug,
                    'mainImages' => $mainImages ? $mainImages->map(fn($image) => ["path" => $image->path]) : null,
                    'price' => PriceForClient::getPrice($model, $model->categories, $model->group, $model->brand, $model->prices, $discounts),
                    'quantity' => $model->productsToB2bWithoutRelation->sum("quantity"),
                    'icons' => $model->colorIcons,
                    'sizes' => $model->productsToB2bWithoutRelation->map(fn($product) => $product->size->name)->unique(),
//                    'sizes' => $model->products->map(fn($product) => $product->size->name)->unique(),
                    'isFavorited' => $model->isFavoritedByClient($client),
                ];
            }
            );

        if ($request->wantsJson()) {
            return response()->json($models);
        }

        return Inertia::render('B2B/Favorites', [
            'models' => $models

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
    public function update(Request $request, ProductModel $productModel)
    {
        $client = Client::find(auth()->user()->client_id);
        $client->favorites()->toggle($productModel->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
