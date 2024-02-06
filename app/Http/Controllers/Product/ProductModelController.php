<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DataProductModelRequest;
use App\Http\Requests\Product\DeleteProductModelRequest;
use App\Http\Requests\Product\StoreProductModelRequest;
use App\Http\Requests\Product\UpdateProductModelRequest;
use App\Jobs\ToSubiekt\ModelTw\CreateModelInSubiekt;
use App\Models\B2cCategory;
use App\Models\B2cColor;
use App\Models\GS1Brand;
use App\Models\GS1GPC;
use App\Models\ProductBrand;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductSize;
use App\Models\Products\ProductUnit;
use Inertia\Inertia;

class ProductModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {

        return Inertia::render("Products/ModelList");
    }

    public function data(DataProductModelRequest $request)
    {
        $mainColumn = [
            'id',
            'symbol',
            'name',
        ];

        $models = ProductModel::with(["colors:id,product_model_id,shortcut,name", "products", "group:id,name", "images"]);
//        dd($models->get()->toArray());

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models = $models->orWhere('id', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('symbol', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('name', 'LIKE', '%' . $word . '%');
            }
        }

        if ($request->filter) {
            foreach (json_decode($request->filter) as $filter) {
                if (in_array($filter->field, $mainColumn)) {
                    switch ($filter->operator) {
                        case "contains":
                            $models = $models->Where($filter->field, 'LIKE', '%' . $filter->value . '%');
                            break;
                        case "equals":
                            $models = $models->Where($filter->field, 'LIKE', $filter->value);
                            break;
                        case "startsWith":
                            $models = $models->Where($filter->field, 'LIKE', $filter->value . '%');
                            break;
                        case "endsWith":
                            $models = $models->Where($filter->field, 'LIKE', '%' . $filter->value);
                            break;
                        case "isEmpty":
                            $models = $models->Where($filter->field, 'LIKE', '');
                            break;
                        case "isNotEmpty":
                            $models = $models->Where($filter->field, 'NOT LIKE', '');
                            break;
                        case "isAnyOf":
                            foreach ($filter->value as $value) {
                                $models = $models->Where($filter->field, 'LIKE', $value);
                            }
                            break;
                    }
                } else {
                    switch ($filter->operator) {
                        case "contains":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'LIKE', '%' . $filter->value . '%');
                            });
                            break;
                        case "equals":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'LIKE', $filter->value);
                            });

                            break;
                        case "startsWith":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'LIKE', $filter->value . '%');
                            });

                            break;
                        case "endsWith":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'LIKE', '%' . $filter->value);
                            });
                            break;
                        case "isEmpty":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'LIKE', '');
                            });
                            break;
                        case "isNotEmpty":
                            $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                return $query->Where("name", 'NOT LIKE', '');
                            });
                            break;
                        case "isAnyOf":
                            foreach ($filter->value as $value) {
                                $models = $models->WhereHas($filter->field, function ($query) use ($value) {
                                    return $query->Where("name", 'LIKE', $value);
                                });
                            }
                            break;
                    }
                }


            }

        }
        $models = $models->orderBy($request->orderBy ? $request->orderBy : "id", $request->order ? $request->order : "asc");

//        dd($models->get(['id', 'symbol', 'name', 'product_group_id'])->toArray());
        $models = $models->paginate($request->limit, ['id', 'symbol', 'name', 'product_group_id']);
        return response()->json([$models]);
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
    public function store(StoreProductModelRequest $request)
    {
        $model = new ProductModel($request->all());
        $model->description_b2b = "";
        $model->description_b2c = "";
        $model->description_allegro = "";
        $model->save();

        $model->prices()->create([]);

        CreateModelInSubiekt::dispatch($model);
    }

    /**
     * Store a duplicate resource in storage.
     */
    public function copy(StoreProductModelRequest $request, ProductModel $productModel)
    {
        $model = $productModel->replicate();
        $model->symbol = $request->symbol;
        $model->name = $request->name;
        $model->save();

        $model->prices()->create($productModel->prices->replicate()->toArray());
        $model->group()->associate($productModel->group);
        $model->brand()->associate($productModel->brand);
        $model->gs1Brand()->associate($productModel->gs1Brand);
        $model->gs1Gpc()->associate($productModel->gs1Gpc);
        CreateModelInSubiekt::dispatch($model);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $productModel = ProductModel::with(["colorsWithImages", "products", "prices", "group", "categories:id", "images", "brand", "gs1Brand", "gs1Gpc", "b2cCategory"])->findOrFail($id);
        $groups = ProductGroup::all();
        $categories = ProductCategory::all();
        $units = ProductUnit::all();
        $sizes = ProductSize::all();
        $brand = ProductBrand::all();
        $gs1Brand = GS1Brand::all();
        $gs1GPC = GS1GPC::all();
        $b2cCategory = B2cCategory::all();
        $b2cColor = B2cColor::all();


        return Inertia::render("Products/Model", [
            "productModel" => $productModel,
            "groups" => $groups,
            "categories" => $categories,
            "units" => $units,
            "sizes" => $sizes,
            "brand" => $brand,
            "gs1" => [
                "brand" => $gs1Brand,
                "gpc" => $gs1GPC,
            ],
            "b2c" => [
                "category" => $b2cCategory,
                "color" => $b2cColor,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $productModel = ProductModel::with(["colorsWithImages", "products", "prices", "group", "categories:id", "images", "brand", "gs1Brand", "gs1Gpc", "b2cCategory"])->findOrFail($id);
        $groups = ProductGroup::all();
        $categories = ProductCategory::all();
        $units = ProductUnit::all();
        $sizes = ProductSize::all();
        $brand = ProductBrand::all();
        $gs1Brand = GS1Brand::all();
        $gs1GPC = GS1GPC::all();
        $b2cCategory = B2cCategory::all();
        $b2cColor = B2cColor::all();

        return Inertia::render("Products/Model", [
            "editing" => true,
            "productModel" => $productModel,
            "groups" => $groups,
            "categories" => $categories,
            "units" => $units,
            "sizes" => $sizes,
            "brand" => $brand,
            "gs1" => [
                "brand" => $gs1Brand,
                "gpc" => $gs1GPC,
            ],
            "b2c" => [
                "category" => $b2cCategory,
                "color" => $b2cColor,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductModelRequest $request, ProductModel $productModel)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductModelRequest $request, ProductModel $productModel)
    {
        $productModel->delete();
    }
}
