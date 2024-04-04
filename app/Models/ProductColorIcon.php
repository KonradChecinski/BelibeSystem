<?php

namespace App\Models;

use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductColorIcon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'hex',
        'path',
    ];

    public function colors(): HasMany
    {
        return $this->hasMany(ProductModelColor::class);
    }
}
