<?php

namespace App\Models\Products;

use App\Models\B2cColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductModelColor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_model_color_id',
        'shortcut',
        'name',
        'product_b2c_color_id'
    ];


    public function model(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, "product_model_id", "id");
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function b2cColor(): BelongsTo
    {
        return $this->belongsTo(B2cColor::class, "product_b2c_color_id");
    }
}
