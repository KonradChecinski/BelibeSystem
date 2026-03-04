<?php

namespace App\Http\Controllers\System\Client;
ini_set('max_execution_time', 600);

use App\Helpers\Gus\Gus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Http\Requests\Product\SearchProductModelRequest;
use App\Models\B2bActivityType;
use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\Client\Client;
use App\Models\ProductBrand;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $b2bCountry = B2bCountry::all();

        return Inertia::render("System/Clients/ClientList",
            [
                "clients" => Client::with(["accountManager:id,name"])->get(), //->get(['id', 'nip', 'name', 'city', 'street', 'building_number', 'apartment_number', 'phone', 'email', 'blacklist', 'user_id', 'status_id']),
                "country" => $b2bCountry
            ]
        );

    }

//    public function data(DataClientRequest $request)
//    {
//        $mainColumn = [
//            'id',
//            'name',
//            'nip',
//            'city',
//            'street',
//            'building_number',
//            'apartment_number',
//            'postal_code',
//            'phone',
//            'email',
//            'priority',
//            'blacklist',
//            'status_id'
//        ];
//
//        $models = Client::with(["accountManager:id,name", /*"colors:id,product_model_id,shortcut,name", "products", "group:id,name", "images"*/]);
////        dd($models->get()->toArray());
//
//        if ($request->search) {
//            foreach (json_decode($request->search) as $word) {
//                foreach ($mainColumn as $item) {
//                    $models = $models->orWhere($item, 'LIKE', '%' . $word . '%');
//                }
//            }
//        }
//
//        if ($request->filter) {
//            foreach (json_decode($request->filter) as $filter) {
//                if ($filter->value != "") {
//                    if (in_array($filter->field, $mainColumn)) {
//                        switch ($filter->operator) {
//                            case "contains":
//                                $models = $models->Where($filter->field, 'LIKE', '%' . $filter->value . '%');
//                                break;
//                            case "equals":
//                                $models = $models->Where($filter->field, 'LIKE', $filter->value);
//                                break;
//                            case "startsWith":
//                                $models = $models->Where($filter->field, 'LIKE', $filter->value . '%');
//                                break;
//                            case "endsWith":
//                                $models = $models->Where($filter->field, 'LIKE', '%' . $filter->value);
//                                break;
//                            case "isEmpty":
//                                $models = $models->Where($filter->field, 'LIKE', '');
//                                break;
//                            case "isNotEmpty":
//                                $models = $models->Where($filter->field, 'NOT LIKE', '');
//                                break;
//                            case "is":
//                                $models = $models->Where($filter->field, '=', $filter->value === "true" ? true : false);
//                                break;
//                            case ">":
//                                $models = $models->Where($filter->field, '>', $filter->value);
//                                break;
//                            case "isAnyOf":
//                                foreach ($filter->value as $value) {
//                                    $models = $models->Where($filter->field, 'LIKE', $value);
//                                }
//                                break;
//                        }
//                    } else {
//                        switch ($filter->operator) {
//                            case "contains":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'LIKE', '%' . $filter->value . '%');
//                                });
//                                break;
//                            case "equals":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'LIKE', $filter->value);
//                                });
//
//                                break;
//                            case "startsWith":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'LIKE', $filter->value . '%');
//                                });
//
//                                break;
//                            case "endsWith":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'LIKE', '%' . $filter->value);
//                                });
//                                break;
//                            case "isEmpty":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'LIKE', '');
//                                });
//                                break;
//                            case "isNotEmpty":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", 'NOT LIKE', '');
//                                });
//                                break;
//                            case "is":
//                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
//                                    return $query->Where("name", '=', $filter->value === "true" ? true : false);
//                                });
//
//                                break;
//                            case "isAnyOf":
//                                foreach ($filter->value as $value) {
//                                    $models = $models->WhereHas($filter->field, function ($query) use ($value) {
//                                        return $query->Where("name", 'LIKE', $value);
//                                    });
//                                }
//                                break;
//                        }
//                    }
//                }
//
//            }
//
//        }
//        $models = $models->orderBy($request->orderBy ? $request->orderBy : "id", $request->order ? $request->order : "asc");
//
////        $sql = Str::replaceArray('?', $models->getBindings(), $models->toSql());
////        dd($sql);
////        dd($models->get(['id', 'symbol', 'name', 'product_group_id'])->toArray());
////        dd($models->get()->toArray());
//        $models = $models->paginate($request->limit, ['id', 'nip', 'name', 'city', 'street', 'building_number', 'apartment_number', 'phone', 'email', 'blacklist', 'user_id', 'status_id']);
//        return response()->json([$models]);
//    }

    public function search(SearchProductModelRequest $request)
    {
        $clients = Client::query()
            ->where("status_id", ">", 1)
            ->where(function ($query) use ($request) {
                $query->where('id', 'LIKE', '%' . $request->search . '%')
                    ->orWhere("name", "LIKE", "%" . $request->search . "%")
                    ->orWhere("nip", "LIKE", "%" . $request->search . "%")
                    ->orWhere("city", "LIKE", "%" . $request->search . "%")
                    ->orWhere("postal_code", "LIKE", "%" . $request->search . "%")
                    ->orWhere("street", "LIKE", "%" . $request->search . "%")
                    ->orWhere("phone", "LIKE", "%" . $request->search . "%")
                    ->orWhere("email", "LIKE", "%" . $request->search . "%");
            })
            ->limit(15)
            ->get(["id", "name", "nip", "city", "postal_code", "street", "building_number", "apartment_number", "phone", "email",]);

        return response()->json($clients);
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
    public function store(StoreClientRequest $request)
    {
        $country = B2bCountry::query()->where("name", $request->country)->first();
        if (is_null($country)) return abort(500);

        if (Client::where("nip", $request->nip)->exists()) {
            return redirect()->back()->withErrors('Klient o podanym NIP już istnieje.');
        }

        $client = new Client($request->all());

        $client->country()->associate($country);
        $client->status()->associate(2);
        $client->sourceOfAcquisition()->associate(1);
        $client->accountManager()->associate(auth()->user());

        $client->industry()->associate(1);


        $client->name = "";
        $client->city = "";
        $client->street = "";
        $client->building_number = "";
        $client->postal_code = "";
        $client->phone = "";
        $client->email = "";
        $client->save();
//        dd($request->all(), $client);
//        return to_route();

        $client->payments()->sync([1]);
        return redirect()->route('system.clients.client.edit', ["id" => $client->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $client = Client::with(["country", "status", "sourceOfAcquisition", "accountManager", "payments", "industry",
            "notes.user:id,name", "locations.country:id,name", "discounts.productModel:id,symbol,name", "discounts.productCategory:id,name",
            "discounts.productGroup:id,name", "discounts.productBrand:id,name",
            "clientUsers", "recipient.country:id,name", "invoices", "invoices.clientOrder", "orders", "orders.invoice", "receivables", "obligations"
        ])->with(["activities" => function ($query) {
            $query->latest()->take(10)->with([
                "user:id,name",
                "activityType:id,name"
            ]);
        },
            "tasks" => function ($query) {
                $query->latest()->take(10)->with([
                    "user:id,name",
                ]);
            },
        ])->findOrFail($id);

        if ($client->buyer_subiekt_id !== null) {
            // Wykonujemy zapytanie do innej bazy danych (np. 'subiekt')
            $client->buyer_subiekt_name = DB::connection('subiekt')
                    ->table('kh__Kontrahent') // przykładowa tabela w Subiekcie
                    ->where('kh_Id', $client->buyer_subiekt_id)
                    ->first()->kh_Symbol . " - " .
                DB::connection('subiekt')
                    ->table('adr__Ewid') // przykładowa tabela w Subiekcie
                    ->where('adr_IdObiektu', $client->buyer_subiekt_id)
                    ->where("adr_TypAdresu", 1) // typ adresu - główny
                    ->first()->adr_NazwaPelna;
        } else {
            $client->buyer_subiekt_name = null;
        }

        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        $b2bIndustry = B2bIndustry::all();
        $users = User::query()->where("active", true)->where("account_manager", true)->get();


        $productModels = ProductModel::whereHas("products", function (Builder $query) {
            $query->where('show_in_b2b', true);
        })->get(["id", "symbol", "name"]);
        $productCategories = ProductCategory::all(["id", "name"]);
        $productGroups = ProductGroup::all(["id", "name"]);
        $productBrands = ProductBrand::all(["id", "name"]);

        return Inertia::render("System/Clients/Client", [
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus,
            "industry" => $b2bIndustry,
            "user" => $users,
            "discountDictionary" => [
                "productModels" => $productModels,
                "productCategories" => $productCategories,
                "productGroups" => $productGroups,
                "productBrands" => $productBrands,
            ]
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $client = Client::with(["country", "status", "sourceOfAcquisition", "accountManager", "payments", "industry",
            "notes.user:id,name", "locations.country:id,name", "discounts.productModel:id,symbol,name", "discounts.productCategory:id,name",
            "discounts.productGroup:id,name", "discounts.productBrand:id,name",
            "clientUsers", "recipient.country:id,name", "invoices", "invoices.clientOrder", "orders", "orders.invoice", "receivables", "obligations", "partner"
        ])->with(["activities" => function ($query) {
            $query->latest()->take(10)->with([
                "user:id,name",
                "activityType:id,name"
            ]);
        },
            "tasks" => function ($query) {
                $query->latest()->take(10)->with([
                    "user:id,name",
                ]);
            },
        ])->findOrFail($id);


        if ($client->buyer_subiekt_id !== null) {
            // Wykonujemy zapytanie do innej bazy danych (np. 'subiekt')
            $client->buyer_subiekt_name = DB::connection('subiekt')
                    ->table('kh__Kontrahent') // przykładowa tabela w Subiekcie
                    ->where('kh_Id', $client->buyer_subiekt_id)
                    ->first()->kh_Symbol . " - " .
                DB::connection('subiekt')
                    ->table('adr__Ewid') // przykładowa tabela w Subiekcie
                    ->where('adr_IdObiektu', $client->buyer_subiekt_id)
                    ->where("adr_TypAdresu", 1) // typ adresu - główny
                    ->first()->adr_NazwaPelna;
        } else {
            $client->buyer_subiekt_name = null;
        }

        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        $b2bIndustry = B2bIndustry::all();

        $users = User::query()->where("active", true)->where("account_manager", true)->get();

        $productModels = ProductModel::whereHas("products", function (Builder $query) {
            $query->where('show_in_b2b', true);
        })->get(["id", "symbol", "name"]);
        $productCategories = ProductCategory::all(["id", "name"]);
        $productGroups = ProductGroup::all(["id", "name"]);
        $productBrands = ProductBrand::all(["id", "name"]);

        return Inertia::render("System/Clients/Client", [
            "editing" => true,
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus,
            "industry" => $b2bIndustry,
            "user" => $users,
            "discountDictionary" => [
                "productModels" => $productModels,
                "productCategories" => $productCategories,
                "productGroups" => $productGroups,
                "productBrands" => $productBrands,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }


    public function getDataFromGUS(Request $request, string $nip)
    {
        return response()->json(Gus::search($nip));
    }
}
