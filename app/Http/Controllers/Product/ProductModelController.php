<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DataProductModelRequest;
use App\Http\Requests\Product\DeleteProductModelRequest;
use App\Http\Requests\Product\StoreProductModelRequest;
use App\Http\Requests\Product\UpdateProductModelRequest;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
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

        $models = ProductModel::with(["colors:id,product_model_id,shortcut,name", "products", "group:id,name"]);
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

//        dd($models->get()->toArray());
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $productModel = ProductModel::with(["colors", "products", "prices", "group", "categories:id", "images"])->find($id);
        $groups = ProductGroup::all();
        $categories = ProductCategory::all();
        $units = ProductUnit::all();

        return Inertia::render("Products/Model", ["productModel" => $productModel, "groups" => $groups, "categories" => $categories, "unit" => $units]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $productModel = ProductModel::with(["colors", "products", "prices", "group", "categories:id", "images"])->find($id);
        $groups = ProductGroup::all();
        $categories = ProductCategory::all();
        $units = ProductUnit::all();

        return Inertia::render("Products/Model", ["editing" => true, "productModel" => $productModel, "groups" => $groups, "categories" => $categories, "unit" => $units]);
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
