<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\Helper;
use App\Helpers\PriceForClient\PriceForClient;
use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bProductCategoryController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $slug)
    {
        $category = ProductCategory::findBySlug($slug);
        if (!$category) {
            abort(404);
        }
        $client = Client::find(Helper::getClientIdToB2b());
        $discounts = $client->discounts;

//        $products = $category->productModels()->whereHas("products", function ($query) {
//            $query->where("show_in_b2b", true);
//        });
//        $models = $category->productModels()
//            ->with(['prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency'])
//            ->paginate(18)
//            ->through(fn($model) => [
//                'id' => $model->id,
//                'name' => $model->name,
//                'symbol' => $model->symbol,
//                'slug' => $model->slug,
//                'mainImages' => $model->mainImages() ? $model->mainImages()->map(fn($image) => ["path" => $image->path]) : null,
//                'price' => array_merge($model->prices->toArray(), $model->priceForClientB2b($client)),
//                'quantity' => $model->quantityToB2b(),
//            ]
//            );

        $models = $category->productModels()
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

        return Inertia::render('B2B/Category', [
            "category" => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ],
            'models' => $models

        ]);
    }

}
