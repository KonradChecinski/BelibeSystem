<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class WarehouseLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_location_aisle_id',
        'name', // np. Shelf 1
        'order',
    ];

    public function aisle(): BelongsTo
    {
        return $this->belongsTo(WarehouseLocationAisle::class, 'warehouse_location_aisle_id');
    }

    public function room(): HasOneThrough
    {
        return $this->hasOneThrough(
            WarehouseLocationRoom::class,
            WarehouseLocationAisle::class,
            'id',                          // foreign key na tabeli aisles
            'id',                          // foreign key na tabeli rooms
            'warehouse_location_aisle_id', // local key w locations
            'warehouse_location_room_id'   // local key w aisles
        );
    }


    public function productModels(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductModel::class,
            'product_model_warehouse_location'
        )->withPivot('is_main')->withTimestamps();
    }
}
