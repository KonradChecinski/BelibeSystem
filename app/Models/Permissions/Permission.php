<?php

namespace App\Models\Permissions;

use Spatie\Permission\Contracts\Permission as PermissionContract;
use Spatie\Permission\Guard;
use \Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name_human',
        'group',
    ];


    public static function findOrCreate(string $name, $guardName = null, $nameHuman = '', $group = ''): PermissionContract
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);
        $permission = static::getPermission(['name' => $name, 'guard_name' => $guardName]);

        if (!$permission) {
            return static::query()->create(['name' => $name, 'guard_name' => $guardName, 'name_human' => $nameHuman, 'group' => $group]);
        }

        return $permission;
    }
}
