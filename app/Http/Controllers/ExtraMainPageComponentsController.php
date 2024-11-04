<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Helpers\Prices\PriceForClient;
use App\Http\Requests\B2bExtraPageBestsellerComponentRequest;
use App\Models\Client\Client;
use App\Models\ClientOrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExtraMainPageComponentsController extends Controller
{
    public function bestsellers(B2bExtraPageBestsellerComponentRequest $request): \Illuminate\Http\JsonResponse
    {
        $client = Client::find(Helper::getClientIdToB2b());
        $discounts = $client->discounts;

        $products = ClientOrderProduct::query()
            ->whereHas('orders', function ($query) {
                $query->where('created_at', '>=', now()->subMonths(1));
            })
            ->select('product_model_colors.product_model_id', DB::raw('SUM(client_order_products.quantity) as total_quantity'))
            ->join('products', 'client_order_products.product_id', '=', 'products.id')
            ->join('product_model_colors', 'products.product_model_color_id', '=', 'product_model_colors.id')
            ->groupBy('product_model_colors.product_model_id')
            ->orderByDesc('total_quantity')
            ->limit($request->quantity)
            ->get();

        $bestsellerModels = $products->map(function ($product) use ($discounts, $client) {
            return [
                'productModel' => ProductModel::query()->whereHas("productsToB2bWithoutRelation", function ($query) {
//                $query->where("quantity", ">", 0);
                    $query->where("show_in_b2b", true);
                })->with([
                    'prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency',
                    'productsToB2bWithoutRelation:quantity,product_model_id,product_size_id,products.id',
                    'productsToB2bWithoutRelation.size',

                    'colorIcons',
//                    'mainImages'
                ])
                    ->where("id", $product->product_model_id)
                    ->get()->map(function ($model) use ($discounts, $client) {
                        $mainImages = $model->mainImages();

                        return [
                            'id' => $model->id,
                            'name' => $model->name,
                            'symbol' => $model->symbol,
                            'slug' => $model->slug,
                            'mainImages' => $mainImages ? $mainImages->sortBy("main")->map(fn($image) => ["path" => $image->path])->values() : null,
                            'price' => PriceForClient::getPrice($model, $model->categories, $model->group, $model->brand, $model->prices, $discounts),
//                            'quantity' => $model->productsToB2bWithoutRelation->sum("quantity"),
                            'icons' => $model->colorIcons,
                            'sizes' => $model->productsToB2bWithoutRelation->map(fn($product) => $product->size->name)->unique()->values(),
//                    'sizes' => $model->products->map(fn($product) => $product->size->name)->unique(),
                            'isFavorited' => $model->isFavoritedByClient($client),
                        ];
                    }
                    )->first()
                ,
                'total_quantity' => $product->total_quantity
            ];
        });
//        dd($bestsellerModels);
        return response()->json($bestsellerModels);
    }
}
