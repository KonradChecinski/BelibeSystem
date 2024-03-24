<?php

namespace App\Http\Controllers;

use App\Models\Client\Client;
use App\Models\Products\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bProductCategoryController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = ProductCategory::findBySlug($slug);
        if (!$category) {
            abort(404);
        }
        $client = Client::find(auth()->user()->client_id);

//        $products = $category->productModels()->whereHas("products", function ($query) {
//            $query->where("show_in_b2b", true);
//        });
        $products = $category->productModels();

        return Inertia::render('B2B/Category', [
            "category" => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ],
            'models' => $products
                ->with(['prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency'])
                ->paginate(18)
                ->through(fn($model) => [
                    'id' => $model->id,
                    'name' => $model->name,
                    'symbol' => $model->symbol,
                    'slug' => $model->slug,
                    'mainImages' => $model->mainImages() ? $model->mainImages()->map(fn($image) => ["path" => $image->path]) : null,
                    'price' => array_merge($model->prices->toArray(), $model->priceForClientB2b($client)),
                    'quantity' => $model->quantityToB2b(),
                ]
                )
        ]);
    }

}
