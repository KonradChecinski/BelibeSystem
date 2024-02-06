<?php

namespace App\Http\Controllers;

use App\Http\Requests\Client\DeleteB2cCategoryRequest;
use App\Http\Requests\Product\StoreB2cCategoryRequest;
use App\Http\Requests\Product\UpdateB2cCategoryRequest;
use App\Models\B2cCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class B2cCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Settings/Dictionaries/B2C/Category");
    }


    public function data(Request $request) //DataProductModelRequest
    {
        $mainColumn = [
            'id',
            'name',
        ];

        $models = B2cCategory::query();
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
    public function store(StoreB2cCategoryRequest $request)
    {
        B2cCategory::create(["name" => $request->name]);

    }

    /**
     * Display the specified resource.
     */
    public function show(B2cCategory $b2cCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(B2cCategory $b2cCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateB2cCategoryRequest $request, B2cCategory $b2cCategory)
    {
        $b2cCategory->update(["name" => $request->name]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteB2cCategoryRequest $request, B2cCategory $b2cCategory)
    {
        $b2cCategory->delete();
    }
}
