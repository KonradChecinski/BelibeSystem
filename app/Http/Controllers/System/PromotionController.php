<?php

namespace App\Http\Controllers\System;

use App\Helpers\Prices\PriceForClient;
use App\Http\Controllers\Controller;
use App\Models\ProductBrand;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\Promotion;
use App\Models\PromotionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PromotionController extends Controller
{
    /**
     * Lista wszystkich promocji (B2B i B2C).
     */
    public function index()
    {
        $promotions = Promotion::query()
            ->with([
                'items.product:id,symbol,product_model_color_id,product_size_id',
                'items.product.size:id,name',
                'items.product.color:id,product_model_id,shortcut,name',
                'items.product.color.model:id,symbol,name',
                'items.productModelColor:id,product_model_id,shortcut,name,product_color_icon_id',
                'items.productModelColor.model:id,symbol,name',
                'items.productModelColor.colorIcon:id,name,type,hex,path',
                'items.productModel:id,symbol,name',
                'items.productCategory:id,name',
                'items.productGroup:id,name',
                'items.productBrand:id,name',
            ])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('System/Promotions/PromotionList', [
            'promotions' => $promotions,
        ]);
    }

    /**
     * Zapis nowej promocji.
     */
    public function store(Request $request)
    {
        $validated = $this->validatePromotion($request);

        $promotion = Promotion::create($this->preparePromotionAttributes($validated));
        PriceForClient::clearPromotionCache();

        return redirect()->route('system.promotions.edit', ['promotion' => $promotion->id]);
    }

    /**
     * Widok edycji promocji i zarządzania przypisanymi towarami (kategorie, grupy, marki, modele, kolory, produkty).
     */
    public function edit(Promotion $promotion)
    {
        $promotion->load([
            'items.product:id,symbol,product_model_color_id,product_size_id',
            'items.product.size:id,name',
            'items.product.color:id,product_model_id,shortcut,name,product_color_icon_id',
            'items.product.color.colorIcon:id,name,type,hex,path',
            'items.product.color.model:id,symbol,name',
            'items.product.color.model.prices:id,product_model_id,wholesale_net_price,wholesale_gross_price,b2c_gross_price,vat_rate,currency',
            'items.productModelColor:id,product_model_id,shortcut,name,product_color_icon_id',
            'items.productModelColor.colorIcon:id,name,type,hex,path',
            'items.productModelColor.model:id,symbol,name',
            'items.productModelColor.model.prices:id,product_model_id,wholesale_net_price,wholesale_gross_price,b2c_gross_price,vat_rate,currency',
            'items.productModel:id,symbol,name',
            'items.productModel.prices:id,product_model_id,wholesale_net_price,wholesale_gross_price,b2c_gross_price,vat_rate,currency',
            'items.productCategory:id,name',
            'items.productGroup:id,name',
            'items.productBrand:id,name',
        ]);

        return Inertia::render('System/Promotions/PromotionEdit', [
            'promotion' => $promotion,
            'dictionaries' => [
                'categories' => ProductCategory::query()->orderBy('name')->get(['id', 'name']),
                'groups' => ProductGroup::query()->orderBy('name')->get(['id', 'name']),
                'brands' => ProductBrand::query()->orderBy('name')->get(['id', 'name']),
                'models' => ProductModel::query()
                    ->with(['prices:id,product_model_id,wholesale_net_price,wholesale_gross_price,b2c_gross_price,vat_rate,currency'])
                    ->orderBy('symbol')
                    ->get(['id', 'symbol', 'name']),
            ],
        ]);
    }

    /**
     * Aktualizacja podstawowych danych promocji.
     */
    public function update(Request $request, Promotion $promotion)
    {
        $validated = $this->validatePromotion($request);

        $promotion->update($this->preparePromotionAttributes($validated));
        PriceForClient::clearPromotionCache();

        return redirect()->back();
    }

    /**
     * Szybkie przełączenie aktywności promocji.
     */
    public function toggleActive(Promotion $promotion)
    {
        $promotion->update([
            'is_active' => !$promotion->is_active,
        ]);
        PriceForClient::clearPromotionCache();

        return redirect()->back();
    }

    /**
     * Usunięcie promocji.
     */
    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        PriceForClient::clearPromotionCache();

        return redirect()->route('system.promotions');
    }

    /**
     * Pobiera szczegóły modelu (kolory wraz z ikonami i zdjęciami oraz produkty z rozmiarami)
     * do wygodnego wybierania konkretnych kolorów i rozmiarów w panelu promocji.
     */
    public function modelDetails(ProductModel $productModel)
    {
        $productModel->load([
            'prices:id,product_model_id,wholesale_net_price,wholesale_gross_price,b2c_gross_price,vat_rate,currency',
            'colors' => function ($q) {
                $q->with([
                    'colorIcon:id,name,type,hex,path',
                    'images' => function ($imgQ) {
                        $imgQ->where('type', 1)->orderBy('order');
                    },
                    'products' => function ($prodQ) {
                        $prodQ->with(['size:id,name']);
                    },
                ]);
            },
        ]);

        return response()->json($productModel);
    }

    /**
     * Dodaje jedną lub wiele pozycji (modele, kolory, produkty, kategorie, grupy, marki, wszystko) do promocji.
     */
    public function addItems(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'type' => 'required|integer|in:1,2,3,4,5,6,7',
            'ids' => 'nullable|array',
            'ids.*' => 'integer',
        ]);

        $type = (int) $validated['type'];
        $ids = $validated['ids'] ?? [];

        DB::transaction(function () use ($promotion, $type, $ids) {
            if ($type === PromotionItem::TYPE_EVERYTHING) {
                $exists = $promotion->items()->where('type', PromotionItem::TYPE_EVERYTHING)->exists();
                if (!$exists) {
                    $promotion->items()->create([
                        'type' => PromotionItem::TYPE_EVERYTHING,
                    ]);
                }
                return;
            }

            $columnMap = [
                PromotionItem::TYPE_PRODUCT => 'product_id',
                PromotionItem::TYPE_COLOR => 'product_model_color_id',
                PromotionItem::TYPE_MODEL => 'product_model_id',
                PromotionItem::TYPE_CATEGORY => 'product_category_id',
                PromotionItem::TYPE_GROUP => 'product_group_id',
                PromotionItem::TYPE_BRAND => 'product_brand_id',
            ];

            $column = $columnMap[$type] ?? null;
            if (!$column || empty($ids)) {
                return;
            }

            $existingIds = $promotion->items()
                ->where('type', $type)
                ->whereIn($column, $ids)
                ->pluck($column)
                ->all();

            $newIds = array_diff(array_unique($ids), $existingIds);

            foreach ($newIds as $targetId) {
                $promotion->items()->create([
                    'type' => $type,
                    $column => $targetId,
                ]);
            }
        });

        PriceForClient::clearPromotionCache();

        return redirect()->back();
    }

    /**
     * Usuwa pojedynczą pozycję z promocji.
     */
    public function removeItem(Promotion $promotion, PromotionItem $promotionItem)
    {
        if ($promotionItem->promotion_id !== $promotion->id) {
            abort(403);
        }

        $promotionItem->delete();
        PriceForClient::clearPromotionCache();

        return redirect()->back();
    }

    /**
     * Usuwa wiele pozycji z promocji jednocześnie (lub wszystkie danego typu).
     */
    public function removeItemsBulk(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'item_ids' => 'required|array',
            'item_ids.*' => 'integer',
        ]);

        $promotion->items()->whereIn('id', $validated['item_ids'])->delete();
        PriceForClient::clearPromotionCache();

        return redirect()->back();
    }

    private function validatePromotion(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'channel' => 'nullable|string|in:b2b,b2c,both',
            'is_b2b' => 'nullable|boolean',
            'is_b2c' => 'nullable|boolean',
            'is_shoper' => 'nullable|boolean',
            'is_allegro' => 'nullable|boolean',
            'is_empik' => 'nullable|boolean',
            'is_tiktok' => 'nullable|boolean',
            'discount_type' => 'required|integer|in:1,2,3',
            'discount_value' => 'required|integer|min:1',
            'show_discount_on_invoice' => 'required|boolean',
            'is_active' => 'required|boolean',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
        ], [
            'name.required' => 'Nazwa promocji jest wymagana.',
            'discount_value.min' => 'Wartość promocji musi być większa od 0.',
            'ends_at.after_or_equal' => 'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.',
        ]);
    }

    private function preparePromotionAttributes(array $validated): array
    {
        $channel = $validated['channel'] ?? null;
        if ($channel === 'b2b') {
            $isB2b = true;
            $isB2c = false;
        } elseif ($channel === 'b2c') {
            $isB2b = false;
            $isB2c = true;
        } elseif ($channel === 'both') {
            $isB2b = true;
            $isB2c = true;
        } else {
            $isB2b = (bool) ($validated['is_b2b'] ?? false);
            $isB2c = (bool) ($validated['is_b2c'] ?? false);
        }

        // Zgodnie z ustaleniem: na ten moment wybór B2C odpowiada za każdy sklep B2C (a w bazie flagi są już przygotowane na przyszłość)
        $isShoper = isset($validated['is_shoper']) ? (bool) $validated['is_shoper'] : $isB2c;
        $isAllegro = isset($validated['is_allegro']) ? (bool) $validated['is_allegro'] : $isB2c;
        $isEmpik = isset($validated['is_empik']) ? (bool) $validated['is_empik'] : $isB2c;
        $isTiktok = isset($validated['is_tiktok']) ? (bool) $validated['is_tiktok'] : $isB2c;

        if ($isB2c && !isset($validated['is_shoper'])) {
            $isShoper = true;
            $isAllegro = true;
            $isEmpik = true;
            $isTiktok = true;
        } elseif (!$isB2c) {
            $isShoper = false;
            $isAllegro = false;
            $isEmpik = false;
            $isTiktok = false;
        }

        return [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_b2b' => $isB2b,
            'is_b2c' => $isB2c,
            'is_shoper' => $isShoper,
            'is_allegro' => $isAllegro,
            'is_empik' => $isEmpik,
            'is_tiktok' => $isTiktok,
            'discount_type' => (int) $validated['discount_type'],
            'discount_value' => (int) $validated['discount_value'],
            'show_discount_on_invoice' => (bool) $validated['show_discount_on_invoice'],
            'is_active' => (bool) $validated['is_active'],
            'starts_at' => !empty($validated['starts_at']) ? $validated['starts_at'] : null,
            'ends_at' => !empty($validated['ends_at']) ? $validated['ends_at'] : null,
        ];
    }
}
