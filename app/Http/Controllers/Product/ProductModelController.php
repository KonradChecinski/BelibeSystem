<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataProductModelRequest;
use App\Http\Requests\StoreProductModelRequest;
use App\Http\Requests\UpdateProductModelRequest;
use App\Models\ProductModel;
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
        $models = ProductModel::with(["colors:id,product_model_id,shortcut,name", "products"])->orderBy($request->orderBy ? $request->orderBy : "id", $request->order ? $request->order : "asc");
        //dd($models->get()->toArray());
        //
        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models->orWhere('id', 'LIKE', '%' . $word . '%');
                $models->orWhere('symbol', 'LIKE', '%' . $word . '%');
                $models->orWhere('name', 'LIKE', '%' . $word . '%');
            }
        }
        $models = $models->paginate($request->limit, ['id', 'symbol', 'name']);
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
        $productModel = ProductModel::with(["colors", "products"])->find($id);
        return Inertia::render("Products/Model", ["productModel" => $productModel]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductModel $productModel)
    {
        //
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
    public function destroy(ProductModel $productModel)
    {
        //
    }
}
