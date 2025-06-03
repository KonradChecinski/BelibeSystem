<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_location_aisles_id',
        'name', // np. Shelf 1
        'order',
    ];

    public function aisle(): BelongsTo
    {
        return $this->belongsTo(WarehouseLocationAisle::class, 'warehouse_location_aisle_id');
    }

    public function productModels(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductModel::class,
            'product_model_warehouse_location'
        )->withPivot('is_main')->withTimestamps();
    }
}
