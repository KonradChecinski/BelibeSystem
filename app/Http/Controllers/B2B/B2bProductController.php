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

        $relations = [
            'prices:product_model_id,wholesale_net_price,wholesale_gross_price,vat_rate,currency',
            'categories:id',
            'group:id',
            'brand:id',
            'colorsToB2b:id,product_model_id,product_color_icon_id',
            'productsToB2bWithoutRelation:quantity,product_model_id,product_size_id,products.id,products.product_model_color_id',
            'productsToB2bWithRelation',
            'sizesToB2b',
        ];

        $productModel = $productModel->load($relations);

        $linkedModels = $productModel->b2bLinkedModels()
            ->whereHas('productsToB2bWithoutRelation', function ($query) {
                $query->where('show_in_b2b', true);
            })
            ->with($relations)
            ->orderBy('symbol')
            ->get();

        $allModels = collect([$productModel])->concat($linkedModels)->unique('id')->values();

        $client = Client::find(Helper::getClientIdToB2b());
        $discounts = $client->discounts;

        $formattedModels = $allModels->map(function (ProductModel $model) use ($client, $discounts) {
            return $this->formatModelForB2bShow($model, $client, $discounts);
        })->values();

        $primaryFormatted = $formattedModels->first();

        $combinedDescription = $primaryFormatted['description_b2b'];
        if (empty(trim(strip_tags((string) $combinedDescription)))) {
            $fallbackDesc = $formattedModels->pluck('description_b2b')->first(function ($desc) {
                return !empty(trim(strip_tags((string) $desc)));
            });
            if ($fallbackDesc) {
                $combinedDescription = $fallbackDesc;
            }
        }

        $combinedColors = $formattedModels->pluck('colors')->flatten(1)->values();
        $combinedSizes = $formattedModels->pluck('sizes')->flatten(1)->unique('id')->values();

        $lightweightModels = $formattedModels->map(fn(array $m) => [
            'id' => $m['id'],
            'name' => $m['name'],
            'symbol' => $m['symbol'],
            'slug' => $m['slug'],
            'price' => $m['price'],
            'isFavorited' => $m['isFavorited'],
        ])->values();

        $cart = $allModels
            ->flatMap(fn(ProductModel $m) => $m->clientsCart($client)->get())
            ->unique('id')
            ->values();

        return Inertia::render('B2B/Model', [
            'model' => array_merge($primaryFormatted, [
                'description_b2b' => $combinedDescription,
                'colors' => $combinedColors,
                'sizes' => $combinedSizes,
                'models' => $lightweightModels,
            ]),
            'cart' => $cart,
        ]);
    }

    /**
     * Formatuje pojedynczy model do widoku karty produktu B2B.
     */
    protected function formatModelForB2bShow(ProductModel $productModel, Client $client, $discounts): array
    {
        $priceForClient = Price::showClientPrices($productModel, $client);
        $currency = $productModel->prices->currency;
        $mainImages = $productModel->mainImages();
        $colorsRelation = $productModel->relationLoaded('productsToB2bWithRelation')
            ? $productModel->productsToB2bWithRelation
            : $productModel->productsToB2bWithRelation()->get();

        return [
            'id' => $productModel->id,
            'name' => $productModel->name,
            'symbol' => $productModel->symbol,
            'slug' => $productModel->slug,
            'description_b2b' => $productModel->description_b2b,
            'mainImages' => $mainImages ? $mainImages->map(fn($image) => ["slug" => $image->slug]) : null,
            'price' => $priceForClient,
            'colors' => $colorsRelation
                ->map(function ($color) use ($productModel, $client, $discounts, $currency) {
                    $colorPrice = PriceForClient::getPriceFromProductModelColor($color, $productModel, $client);

                    return [
                        'id' => $color->id,
                        'product_model_id' => $productModel->id,
                        'product_model_symbol' => $productModel->symbol,
                        'product_model_name' => $productModel->name,
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
                })->values(),
            'sizes' => $productModel->sizesToB2b->map(fn($size) => [
                "id" => $size->id,
                "name" => $size->name
            ])->unique('id')->values(),
            'isFavorited' => $productModel->isFavoritedByClient($client),
        ];
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
