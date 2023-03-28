<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class ProductModel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'symbol',
        'name',
    ];

    public function colors(): HasMany {
        return $this->hasMany(ProductModelColor::class);
    }

    public function products(): HasManyThrough {
        return $this->hasManyThrough(Product::class, ProductModelColor::class);
    }
}
