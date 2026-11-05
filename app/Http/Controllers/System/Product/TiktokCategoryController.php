<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteTiktokCategoryRequest;
use App\Http\Requests\Product\StoreTiktokCategoryRequest;
use App\Http\Requests\Product\UpdateTiktokCategoryRequest;
use App\Models\ProductTiktokCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TiktokCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Models/B2C/TiktokCategory");
    }

    public function data(Request $request)
    {
        $mainColumn = [
            'id',
            'name',
            'value',
        ];

        $models = ProductTiktokCategory::query();

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models = $models->orWhere('id', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('name', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('value', 'LIKE', '%' . $word . '%');
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
                }
            }
        }

        $models = $models->orderBy($request->orderBy ? $request->orderBy : "id", $request->order ? $request->order : "asc");
        $models = $models->paginate($request->limit, ['id', 'name', 'value']);

        return response()->json([$models]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTiktokCategoryRequest $request)
    {
        ProductTiktokCategory::create([
            "name" => $request->name,
            "value" => $request->value,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTiktokCategoryRequest $request, ProductTiktokCategory $tiktokCategory)
    {
        $tiktokCategory->update([
            "name" => $request->name,
            "value" => $request->value,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteTiktokCategoryRequest $request, ProductTiktokCategory $tiktokCategory)
    {
        $tiktokCategory->delete();
    }
}

