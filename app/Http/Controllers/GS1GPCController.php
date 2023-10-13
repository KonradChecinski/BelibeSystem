<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteGS1GPCRequest;
use App\Models\GS1GPC;
use App\Http\Requests\StoreGS1GPCRequest;
use App\Http\Requests\UpdateGS1GPCRequest;
use App\Models\Products\ProductUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GS1GPCController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Settings/Dictionaries/GS1/GPC");

    }

    public function data(Request $request) //DataProductModelRequest
    {
        $mainColumn = [
            'id',
            'name',
            'value',
        ];

        $models = GS1GPC::query();
//        dd($models->get()->toArray());

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
        $models = $models->paginate($request->limit, ['id', 'name', 'value']);
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
    public function store(StoreGS1GPCRequest $request)
    {
        GS1GPC::create([
            "name" => $request->name,
            "value" => $request->value
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(GS1GPC $gS1GPC)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GS1GPC $gS1GPC)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGS1GPCRequest $request, GS1GPC $GS1GPC)
    {
        $GS1GPC->update([
            "name" => $request->name,
            "value" => $request->value
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteGS1GPCRequest $request, GS1GPC $GS1GPC)
    {
        $GS1GPC->delete();
    }
}
