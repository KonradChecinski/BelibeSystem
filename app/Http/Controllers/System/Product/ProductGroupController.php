<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductGroupRequest;
use App\Http\Requests\Product\StoreProductGroupRequest;
use App\Http\Requests\Product\UpdateProductGroupRequest;
use App\Models\Products\ProductGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Models/Group");
    }

    public function data(Request $request) //DataProductModelRequest
    {
        $mainColumn = [
            'id',
            'name',
        ];

        $models = ProductGroup::query();
//        dd($models->get()->toArray());

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models = $models->orWhere('id', 'LIKE', '%' . $word . '%');
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
        $models = $models->paginate($request->limit, ['id', 'name']);
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
    public function store(StoreProductGroupRequest $request)
    {
        ProductGroup::create(["name" => strtoupper($request->name)]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductGroup $productGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductGroup $productGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductGroupRequest $request, ProductGroup $productGroup)
    {
        $productGroup->update(["name" => strtoupper($request->name)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductGroupRequest $request, ProductGroup $productGroup)
    {
        $productGroup->delete();
    }
}
