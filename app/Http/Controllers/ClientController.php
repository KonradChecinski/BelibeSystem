<?php

namespace App\Http\Controllers;
ini_set('max_execution_time', 600);

use App\Helpers\Shoper\Shoper;
use App\Http\Requests\Auth\StoreClientRequest;
use App\Http\Requests\Auth\UpdateClientRequest;
use App\Http\Requests\Client\DataClientRequest;
use App\Jobs\FromSubiekt\Cena\UpdatePriceFromSubiekt;
use App\Jobs\FromSubiekt\ModelTw\CreateModelFromSubiekt;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Jobs\FromSubiekt\Tw\CreateTwFromSubiekt;
use App\Jobs\FromSubiekt\Tw\UpdateTwFromSubiekt;
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\Shoper\ShoperChangePrice;
use App\Jobs\Shoper\ShoperChangeShow;
use App\Jobs\Shoper\ShoperOrderCreateInSubiekt;
use App\Jobs\ToSubiekt\Images\AddImagesToSubiekt;
use App\Jobs\ToSubiekt\ModelTw\CheckIfExistModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\CreateTowarInSubiekt;
use App\Jobs\UpdateSubiektIdWhereNull;
use App\Models\B2bActivityType;
use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\B2cColor;
use App\Models\Client\Client;
use App\Models\Products\Product;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\Towar;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $b2bCountry = B2bCountry::all();

        return Inertia::render("Clients/ClientList", ["country" => $b2bCountry]);

    }

    public function data(DataClientRequest $request)
    {
        $mainColumn = [
            'id',
            'name',
            'nip',
            'city',
            'street',
            'building_number',
            'apartment_number',
            'postal_code',
            'phone',
            'email',
            'priority',
            'blacklist',
        ];

        $models = Client::with(["accountManager:name", /*"colors:id,product_model_id,shortcut,name", "products", "group:id,name", "images"*/]);
//        dd($models->get()->toArray());

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                foreach ($mainColumn as $item) {
                    $models = $models->orWhere($item, 'LIKE', '%' . $word . '%');
                }
            }
        }

        if ($request->filter) {
            foreach (json_decode($request->filter) as $filter) {
                if ($filter->value != "") {
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
                            case "is":
                                $models = $models->Where($filter->field, '=', $filter->value === "true" ? true : false);
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
                            case "is":
                                $models = $models->WhereHas($filter->field, function ($query) use ($filter) {
                                    return $query->Where("name", '=', $filter->value === "true" ? true : false);
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

        }
        $models = $models->orderBy($request->orderBy ? $request->orderBy : "id", $request->order ? $request->order : "asc");

//        $sql = Str::replaceArray('?', $models->getBindings(), $models->toSql());
//        dd($sql);
//        dd($models->get(['id', 'symbol', 'name', 'product_group_id'])->toArray());
        $models = $models->paginate($request->limit, ['id', 'nip', 'name', 'city', 'street', 'building_number', 'apartment_number', 'phone', 'email', 'blacklist']);
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
    public function store(StoreClientRequest $request)
    {
        $model = new Client($request->all());
//        $model->description_b2b = "";
//        $model->description_b2c = "";
//        $model->description_allegro = "";
        $model->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $client = Client::with(["country", "status", "sourceOfAcquisition", "accountManager", "payment", "industry"])->findOrFail($id);

        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        $b2bIndustry = B2bIndustry::all();
        return Inertia::render("Clients/Client", [
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus,
            "industry" => $b2bIndustry
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $client = Client::with(["country", "status", "sourceOfAcquisition", "accountManager", "payment", "industry"])->findOrFail($id);

        $b2bActivityType = B2bActivityType::all();
        $b2bCountry = B2bCountry::all();
        $b2bPayment = B2bPayment::all();
        $b2bSourceOfAcquisition = B2bSourceOfAcquisition::all();
        $b2bStatus = B2bStatus::all();
        $b2bIndustry = B2bIndustry::all();
        return Inertia::render("Clients/Client", [
            "editing" => true,
            "client" => $client,
            "activityType" => $b2bActivityType,
            "country" => $b2bCountry,
            "payment" => $b2bPayment,
            "sourceOfAcquisition" => $b2bSourceOfAcquisition,
            "status" => $b2bStatus,
            "industry" => $b2bIndustry
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
}
