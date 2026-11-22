<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\Helper;
use App\Helpers\Prices\PriceForClient;
use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2bPromotionsController extends Controller
{
    /**
     * Wyświetla stronę z modelami objętymi aktywnymi promocjami B2B.
     */
    public function index(Request $request)
    {
        $client = Client::find(Helper::getClientIdToB2b());
        $discounts = $client->discounts;

        $models = PriceForClient::getPromotedProductModelIdsQuery()
            ->with([
                'prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency',
                'categories:id',
                'group:id',
                'brand:id',
                'colorsToB2b:id,product_model_id,product_color_icon_id',
                'productsToB2bWithoutRelation:quantity,product_model_id,product_size_id,products.id,products.product_model_color_id',
                'productsToB2bWithoutRelation.size',
                'colorIconsOnlyProductToB2b',
            ])
            ->paginate(24)
            ->through(function ($model) use ($discounts, $client) {
                $mainImages = $model->mainImages();

                return [
                    'id' => $model->id,
                    'name' => $model->name,
                    'symbol' => $model->symbol,
                    'slug' => $model->slug,
                    'mainImages' => $mainImages ? $mainImages->sortBy('main')->map(fn($image) => ['slug' => $image->slug])->values() : null,
                    'price' => PriceForClient::getPrice($model, $model->categories, $model->group, $model->brand, $model->prices, $discounts),
                    'icons' => $model->colorIconsOnlyProductToB2b,
                    'sizes' => $model->productsToB2bWithoutRelation->map(fn($product) => $product->size->name)->unique()->values(),
                    'isFavorited' => $model->isFavoritedByClient($client),
                ];
            });

        if ($request->wantsJson()) {
            return response()->json($models);
        }

        return Inertia::render('B2B/Promotions', [
            'models' => $models,
        ]);
    }
}
