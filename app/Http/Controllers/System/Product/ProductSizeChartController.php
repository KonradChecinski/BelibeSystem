<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteProductSizeChartRequest;
use App\Http\Requests\Product\StoreProductSizeChartRequest;
use App\Http\Requests\Product\UpdateProductSizeChartRequest;
use App\Jobs\TikTok\TikTokChangePrice;
use App\Models\ProductSizeChart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSizeChartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Models/B2C/SizeChart");
    }

    public function data(Request $request)
    {
        $mainColumn = [
            'id',
            'name',
            'tiktok_template_id',
        ];

        $models = ProductSizeChart::query();

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models = $models->orWhere('id', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('name', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('tiktok_template_id', 'LIKE', '%' . $word . '%');
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
        $models = $models->paginate($request->limit ?: 100, ['id', 'name', 'table_data', 'tiktok_template_id', 'tiktok_image_uri']);

        return response()->json([$models]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductSizeChartRequest $request)
    {
        ProductSizeChart::create([
            'name' => $request->name,
            'table_data' => $request->table_data,
            'tiktok_template_id' => $request->tiktok_template_id ?: null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductSizeChartRequest $request, ProductSizeChart $sizeChart)
    {
        $sizeChart->update([
            'name' => $request->name,
            'table_data' => $request->table_data,
            'tiktok_template_id' => $request->tiktok_template_id ?: null,
            'tiktok_image_uri' => null,
        ]);

        foreach ($sizeChart->models as $productModel) {
            TikTokChangePrice::dispatch($productModel);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteProductSizeChartRequest $request, ProductSizeChart $sizeChart)
    {
        $sizeChart->delete();
    }
}

