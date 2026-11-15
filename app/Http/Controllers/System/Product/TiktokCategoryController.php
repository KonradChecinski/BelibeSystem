<?php

namespace App\Http\Controllers\System\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeleteTiktokCategoryRequest;
use App\Http\Requests\Product\StoreTiktokCategoryRequest;
use App\Http\Requests\Product\UpdateTiktokCategoryRequest;
use App\Models\ProductTiktokCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laraditz\TikTok\Models\TiktokShop;

class TiktokCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("System/Settings/Dictionaries/Models/B2C/TiktokCategory");
    }

    /**
     * Fetch and display categories and shop configuration IDs directly from TikTok Shop API.
     */
    public function apiList(Request $request)
    {
        $user = auth()->user();
        abort_unless(
            $user && (
                $user->hasRole('Administrator', 'user')
                || $user->hasPermissionTo('editDictionary', 'user')
                || $user->hasPermissionTo('editSetting', 'user')
            ),
            403
        );

        $tiktok = app('tiktok');

        $currentConfig = [
            'shop_id' => (string) config('tiktok.shop_id'),
            'warehouse_id' => (string) config('tiktok.warehouse_id'),
            'manufacturer_id' => (string) config('tiktok.manufacturer_id'),
            'responsible_person_id' => (string) config('tiktok.responsible_person_id'),
        ];

        $shop = TiktokShop::query()
            ->when(config('tiktok.shop_id'), fn ($q, $id) => $q->where('id', $id))
            ->first() ?? TiktokShop::query()->first();

        if (!$shop) {
            return Inertia::render("System/Settings/Dictionaries/Models/B2C/TiktokCategoryApiList", [
                'shop' => null,
                'currentConfig' => $currentConfig,
                'warehouses' => [],
                'manufacturers' => [],
                'responsiblePersons' => [],
                'authUrl' => config('tiktok.service_id') ? $tiktok->authorizationUrl() : null,
                'callbackUrl' => url('/tiktok/seller/authorized'),
                'categories' => [],
                'existingValues' => [],
                'locale' => $request->query('locale', 'pl-PL'),
                'error' => 'Brak autoryzowanego sklepu w tabeli tiktok_shops.',
            ]);
        }

        $locale = $request->query('locale', 'pl-PL');
        $query = array_filter([
            'locale' => $locale,
            'keyword' => $request->query('keyword'),
            'category_version' => $request->query('category_version'),
        ]);

        $warehouses = [];
        $warehousesError = null;
        try {
            $whResponse = $tiktok->shopId($shop->id)->product()->warehouses();
            foreach (data_get($whResponse, 'data.warehouses', []) as $wh) {
                $warehouses[] = [
                    'id' => (string) ($wh['id'] ?? ''),
                    'name' => (string) ($wh['name'] ?? ''),
                    'type' => (string) ($wh['type'] ?? ''),
                    'is_default' => (bool) ($wh['is_default'] ?? false),
                ];
            }
        } catch (\Throwable $e) {
            $warehousesError = $e->getMessage();
        }

        $manufacturers = [];
        $manufacturersError = null;
        $rawManufacturers = null;
        foreach (['searchManufacturers', 'searchManufacturersV202409'] as $method) {
            foreach (['seller', 'product'] as $service) {
                foreach ([['keyword' => ''], ['locales' => [$locale, 'en-IE', 'en-GB']]] as $bodyPayload) {
                    try {
                        $mResponse = $tiktok->shopId($shop->id)->{$service}()->{$method}(
                            query: ['page_size' => 50],
                            body: $bodyPayload
                        );
                        $rawManufacturers = data_get($mResponse, 'data.manufacturers', []);
                        $manufacturersError = null;
                        break 3;
                    } catch (\Throwable $e) {
                        $manufacturersError = $e->getMessage();
                    }
                }
            }
        }

        if (is_array($rawManufacturers)) {
            foreach ($rawManufacturers as $m) {
                $id = (string) ($m['id'] ?? $m['manufacturer_id'] ?? '');
                if ($id === '') {
                    continue;
                }
                $name = (string) (
                    $m['name']
                    ?? data_get($m, 'regional_profiles.0.name')
                    ?? $m['registered_trade_name']
                    ?? data_get($m, 'regional_profiles.0.registered_trade_name')
                    ?? ''
                );
                $email = (string) (
                    $m['email']
                    ?? data_get($m, 'regional_profiles.0.email')
                    ?? ''
                );
                $manufacturers[] = [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email,
                ];
            }
        }

        $responsiblePersons = [];
        $responsiblePersonsError = null;
        $rawResponsiblePersons = null;
        foreach (['searchResponsiblePersons', 'searchResponsiblePersonsV202409'] as $method) {
            foreach (['seller', 'product'] as $service) {
                foreach ([['keyword' => ''], ['locales' => [$locale, 'en-IE', 'en-GB']]] as $bodyPayload) {
                    try {
                        $rpResponse = $tiktok->shopId($shop->id)->{$service}()->{$method}(
                            query: ['page_size' => 50],
                            body: $bodyPayload
                        );
                        $rawResponsiblePersons = data_get($rpResponse, 'data.responsible_persons', []);
                        $responsiblePersonsError = null;
                        break 3;
                    } catch (\Throwable $e) {
                        $responsiblePersonsError = $e->getMessage();
                    }
                }
            }
        }

        if (is_array($rawResponsiblePersons)) {
            foreach ($rawResponsiblePersons as $rp) {
                $id = (string) ($rp['id'] ?? $rp['responsible_person_id'] ?? '');
                if ($id === '') {
                    continue;
                }
                $name = (string) (
                    $rp['name']
                    ?? data_get($rp, 'regional_profiles.0.name')
                    ?? ''
                );
                $email = (string) (
                    $rp['email']
                    ?? data_get($rp, 'regional_profiles.0.email')
                    ?? ''
                );
                $responsiblePersons[] = [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email,
                ];
            }
        }

        try {
            $response = $tiktok
                ->shopId($shop->id)
                ->product()
                ->categories(query: $query);

            $rawCategories = data_get($response, 'data.categories', []);
        } catch (\Throwable $e) {
            return Inertia::render("System/Settings/Dictionaries/Models/B2C/TiktokCategoryApiList", [
                'shop' => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                ],
                'currentConfig' => $currentConfig,
                'warehouses' => $warehouses,
                'warehousesError' => $warehousesError,
                'manufacturers' => $manufacturers,
                'manufacturersError' => $manufacturersError,
                'responsiblePersons' => $responsiblePersons,
                'responsiblePersonsError' => $responsiblePersonsError,
                'categories' => [],
                'existingValues' => [],
                'locale' => $locale,
                'error' => $e->getMessage(),
            ]);
        }

        $byId = [];
        foreach ($rawCategories as $cat) {
            $id = (string) ($cat['id'] ?? '');
            if ($id !== '') {
                $byId[$id] = $cat;
            }
        }

        $buildFullPath = function (string $id) use (&$byId): string {
            $parts = [];
            $currentId = $id;
            $visited = [];

            while ($currentId !== '' && $currentId !== '0' && isset($byId[$currentId]) && !isset($visited[$currentId])) {
                $visited[$currentId] = true;
                $node = $byId[$currentId];
                array_unshift($parts, $node['local_name'] ?? $currentId);
                $currentId = (string) ($node['parent_id'] ?? '0');
            }

            return implode(' - ', $parts);
        };

        $existingValues = ProductTiktokCategory::query()
            ->pluck('id', 'value')
            ->toArray();

        $categories = [];
        foreach ($rawCategories as $cat) {
            $id = (string) ($cat['id'] ?? '');
            if ($id === '') {
                continue;
            }

            $fullPath = $buildFullPath($id);
            $categories[] = [
                'id' => $id,
                'local_name' => $cat['local_name'] ?? '',
                'full_path' => $fullPath,
                'parent_id' => (string) ($cat['parent_id'] ?? '0'),
                'is_leaf' => (bool) ($cat['is_leaf'] ?? false),
                'permission_statuses' => $cat['permission_statuses'] ?? [],
                'already_added' => isset($existingValues[$id]),
            ];
        }

        return Inertia::render("System/Settings/Dictionaries/Models/B2C/TiktokCategoryApiList", [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
            ],
            'currentConfig' => $currentConfig,
            'warehouses' => $warehouses,
            'warehousesError' => $warehousesError,
            'manufacturers' => $manufacturers,
            'manufacturersError' => $manufacturersError,
            'responsiblePersons' => $responsiblePersons,
            'responsiblePersonsError' => $responsiblePersonsError,
            'categories' => $categories,
            'existingValues' => array_keys($existingValues),
            'locale' => $locale,
            'error' => null,
        ]);
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
        $category = ProductTiktokCategory::firstOrCreate(
            ["value" => $request->value],
            ["name" => $request->name]
        );

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'status' => 'ok',
                'category' => $category,
            ]);
        }
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

