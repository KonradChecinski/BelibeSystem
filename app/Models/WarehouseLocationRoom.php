<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class WarehouseLocationRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order',
    ];

    public function aisles(): HasMany
    {
        return $this->hasMany(WarehouseLocationAisle::class);
    }

    public function locations(): HasManyThrough
    {
        return $this->hasManyThrough(
            WarehouseLocation::class,
            WarehouseLocationAisle::class,
            'warehouse_location_room_id', // foreign key w aisles
            'warehouse_location_aisle_id', // foreign key w locations
            'id',                          // local key w rooms
            'id'                           // local key w aisles
        );
    }

}
