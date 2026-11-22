<?php

namespace App\Http\Controllers\B2B;

use App\Helpers\Helper;
use App\Helpers\Prices\Price;
use App\Helpers\Prices\PriceForClient;
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
            'categories:id',
            'group:id',
            'brand:id',
            'colorsToB2b:id,product_model_id,product_color_icon_id',
            'productsToB2bWithoutRelation:quantity,product_model_id,product_size_id,products.id,products.product_model_color_id',
            "productsToB2bWithRelation",
            "sizesToB2b",
        ]);
        $client = Client::find(Helper::getClientIdToB2b());

        $priceForClient = Price::showClientPrices($productModel, $client);
        $currency = $productModel->prices->currency;
        $discounts = $client->discounts;

        return Inertia::render('B2B/Model',
            [
                "model" => [
                    'id' => $productModel->id,
                    'name' => $productModel->name,
                    'symbol' => $productModel->symbol,
                    'slug' => $productModel->slug,
                    'description_b2b' => $productModel->description_b2b,
                    'mainImages' => $productModel->mainImages() ? $productModel->mainImages()->map(fn($image) => ["slug" => $image->slug]) : null,
                    'price' => $priceForClient,
                    'colors' => $productModel->productsToB2bWithRelation()
                        ->get()
                        ->map(function ($color) use ($productModel, $client, $discounts, $currency) {
                            $colorPrice = PriceForClient::getPriceFromProductModelColor($color, $productModel, $client);

                            return [
                                'id' => $color->id,
                                'name' => $color->name,
                                'shortcut' => $color->shortcut,
                                'images' => $color->images,
                                'color_icon' => $color->colorIcon,
                                'price' => [
                                    'price_net' => $colorPrice['discounted_wholesale_net_price'],
                                    'price_gross' => $colorPrice['discounted_wholesale_gross_price'],
                                    'min_price_net' => $colorPrice['min_discounted_wholesale_net_price'],
                                    'min_price_gross' => $colorPrice['min_discounted_wholesale_gross_price'],
                                    'original_price_net' => $colorPrice['original_wholesale_net_price'],
                                    'original_price_gross' => $colorPrice['original_wholesale_gross_price'],
                                    'vat_rate' => $colorPrice['vat_rate'],
                                    'currency' => $currency,
                                    'is_promotion' => $colorPrice['is_promotion'],
                                    'applied_promotion' => $colorPrice['applied_promotion'],
                                    'has_product_promotion' => $colorPrice['has_product_promotion'],
                                    'has_variable_prices' => $colorPrice['has_variable_prices'],
                                    'promotion_level' => $colorPrice['promotion_level'],
                                    'promotion_name' => $colorPrice['promotion_name'],
                                    'show_discount_on_invoice' => $colorPrice['show_discount_on_invoice'],
                                ],

                                'products' => $color->products->map(function ($product) use ($productModel, $color, $discounts, $currency) {
                                    $productPrice = PriceForClient::evaluatePriceForTarget(
                                        productModel: $productModel,
                                        categories: $productModel->categories,
                                        group: $productModel->group,
                                        brand: $productModel->brand,
                                        price: $productModel->prices,
                                        discounts: $discounts,
                                        colorId: $color->id,
                                        productId: $product->id
                                    );

                                    return [
                                        'id' => $product->id,
                                        'symbol' => $product->symbol,
                                        'available_without_order_to_edit' => $product->available_without_order_to_edit,
                                        'size' => [
                                            'id' => $product->size->id,
                                            'name' => $product->size->name,
                                        ],
                                        'price' => [
                                            'price_net' => $productPrice['discounted_wholesale_net_price'],
                                            'price_gross' => $productPrice['discounted_wholesale_gross_price'],
                                            'original_price_net' => $productPrice['original_wholesale_net_price'],
                                            'original_price_gross' => $productPrice['original_wholesale_gross_price'],
                                            'vat_rate' => $productPrice['vat_rate'],
                                            'currency' => $currency,
                                            'is_promotion' => $productPrice['is_promotion'],
                                            'applied_promotion' => $productPrice['applied_promotion'],
                                            'promotion_level' => $productPrice['promotion_level'],
                                            'promotion_name' => $productPrice['promotion_name'],
                                            'show_discount_on_invoice' => $productPrice['show_discount_on_invoice'],
                                        ],
                                    ];
                                })->values(),
                            ];
                        })->values()
                    ,
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
