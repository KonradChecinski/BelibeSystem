<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateB2BProductModelRequest;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stevebauman\Purify\Facades\Purify;

class B2BProductModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(string $id)
    {
        //
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
    public function update(UpdateB2BProductModelRequest $request, ProductModel $productModel)
    {
        DB::transaction(function () use ($request, $productModel) {
            $productModel->update([
                "description_b2b" => Purify::config("descriptions")->clean($request->description_b2b ?? "")
            ]);
            $productModel->categories()->sync($request->categories ?? []);

            if ($request->has('linked_models')) {
                $this->syncB2bLinkedModels($productModel, $request->input('linked_models', []));
            }
        });
    }

    /**
     * Synchronizuje dwukierunkowo grupę połączonych modeli B2B.
     */
    protected function syncB2bLinkedModels(ProductModel $productModel, array $linkedModelIds): void
    {
        $newLinkedIds = collect($linkedModelIds)
            ->map(fn($id) => (int) $id)
            ->filter(fn($id) => $id > 0 && $id !== (int) $productModel->id)
            ->unique()
            ->values()
            ->all();

        $oldLinkedIds = $productModel->b2bLinkedModels()
            ->pluck('product_models.id')
            ->map(fn($id) => (int) $id)
            ->all();

        $removedIds = array_values(array_diff($oldLinkedIds, $newLinkedIds));

        if (!empty($removedIds)) {
            $groupWithOld = array_values(array_unique(array_merge([$productModel->id], $oldLinkedIds, $newLinkedIds)));
            DB::table('b2b_linked_product_models')
                ->where(function ($q) use ($removedIds, $groupWithOld) {
                    $q->whereIn('product_model_id', $removedIds)
                        ->whereIn('linked_product_model_id', $groupWithOld);
                })
                ->orWhere(function ($q) use ($removedIds, $groupWithOld) {
                    $q->whereIn('product_model_id', $groupWithOld)
                        ->whereIn('linked_product_model_id', $removedIds);
                })
                ->delete();
        }

        if (empty($newLinkedIds)) {
            DB::table('b2b_linked_product_models')
                ->where('product_model_id', $productModel->id)
                ->orWhere('linked_product_model_id', $productModel->id)
                ->delete();
            return;
        }

        $existingPeersOfNew = DB::table('b2b_linked_product_models')
            ->whereIn('product_model_id', $newLinkedIds)
            ->pluck('linked_product_model_id')
            ->map(fn($id) => (int) $id)
            ->reject(fn($id) => in_array($id, $removedIds, true))
            ->all();

        $fullGroupIds = array_values(array_unique(array_merge(
            [$productModel->id],
            $newLinkedIds,
            $existingPeersOfNew
        )));

        $now = now();
        $rows = [];
        foreach ($fullGroupIds as $idA) {
            foreach ($fullGroupIds as $idB) {
                if ($idA !== $idB) {
                    $rows[] = [
                        'product_model_id' => $idA,
                        'linked_product_model_id' => $idB,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        if (!empty($rows)) {
            DB::table('b2b_linked_product_models')->insertOrIgnore($rows);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
