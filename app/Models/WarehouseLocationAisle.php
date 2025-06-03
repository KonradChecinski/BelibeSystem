<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseLocationAisle extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_location_room_id',
        'name', // np. A, B
        'order', // Kolejność wyświetlania
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(WarehouseLocationRoom::class, 'warehouse_location_room_id');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(WarehouseLocation::class);
    }
}
