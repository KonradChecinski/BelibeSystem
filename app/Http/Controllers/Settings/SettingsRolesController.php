<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DeleteSettingsRolesRequest;
use App\Http\Requests\Settings\StoreSettingsRolesRequest;
use App\Http\Requests\Settings\UpdateSettingsRolesRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SettingsRolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Settings/Roles");
    }


    public function data(Request $request) //DataProductModelRequest
    {
        $mainColumn = [
            'id',
            'name',
        ];

        $models = Role::withCount("users");
//        dd($models->get()->toArray());

        if ($request->search) {
            foreach (json_decode($request->search) as $word) {
                $models = $models->orWhere('id', 'LIKE', '%' . $word . '%');
                $models = $models->orWhere('name', 'LIKE', '%' . $word . '%');
            }
        }

        if ($request->filter) {
            foreach (json_decode($request->filter) as $filter) {
                if (in_array($filter->field, $mainColumn) && isset($filter->value)) {
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
                } else if (isset($filter->value)) {
                    switch ($filter->operator) {
                        case "contains":
                            $models = $models->Having($filter->field, 'LIKE', '%' . $filter->value . '%');
                            break;
                        case "equals":
                            $models = $models->Having($filter->field, 'LIKE', $filter->value);
                            break;
                        case "startsWith":
                            $models = $models->Having($filter->field, 'LIKE', $filter->value . '%');
                            break;
                        case "endsWith":
                            $models = $models->Having($filter->field, 'LIKE', '%' . $filter->value);
                            break;
                        case "isEmpty":
                            $models = $models->Having($filter->field, 'LIKE', '');
                            break;
                        case "isNotEmpty":
                            $models = $models->Having($filter->field, 'NOT LIKE', '');
                            break;
                        case "isAnyOf":
                            foreach ($filter->value as $value) {
                                $models = $models->Having($filter->field, 'LIKE', $value);
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
    public function store(StoreSettingsRolesRequest $request)
    {
        Role::findOrCreate($request->name, "user");
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $settingsRoles)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $settingsRoles)
    {
        $role = Role::findById($settingsRoles, "user");
        $permissions = $role->getAllPermissions()->map(function ($item) {
            return ['id' => $item['id']];//, 'name' => $item['name']
        })->toArray();
        $role = $role->toArray();
        $role['permissions'] = $permissions;

        return Inertia::render("Settings/RolesEdit", ["role" => $role, "permissions" => Permission::all()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSettingsRolesRequest $request, Role $settingsRole)
    {
        $settingsRole->syncPermissions($request->permissions);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteSettingsRolesRequest $request, int $settingsRoles)
    {
        $role = Role::findById($settingsRoles, "user");
        if ($role->id == 1) abort(403);
        $role->delete();
    }
}
