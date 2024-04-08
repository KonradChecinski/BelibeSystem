<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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

    public function colorsWithModels(): HasMany
    {
        return $this->colors()->with("model");
    }
}
