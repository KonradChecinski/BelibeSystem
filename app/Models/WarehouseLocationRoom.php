<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

}
