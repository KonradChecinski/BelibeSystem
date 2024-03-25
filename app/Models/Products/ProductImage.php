<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class ProductImage extends Model
{
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_model_color_id',
        'order',
        'path',
        'width',
        'height',
        'type',
        'publish',
        'main'
    ];


    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, "product_model_color_id", "id");
    }

    public function model(): HasOneThrough
    {
        return $this->hasOneThrough(ProductModel::class, ProductModelColor::class, "id", "id", "product_model_color_id", "product_model_id");
    }
}
