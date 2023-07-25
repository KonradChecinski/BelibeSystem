<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_model_color_id',
        'product_group_id',
        'subiekt_id',
        'symbol',
        'name',
        'barcode',
        'product_unit_id',
        'size',
        'show_in_b2b',
        'show_in_b2c',
        'show_in_allegro',
        'show_in_subiekt',

    ];

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class);
    }

    public function images(): hasManyThrough
    {
        return $this->hasManyThrough(ProductImage::class, ProductModelColor::class);
        //Może nie działać
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class);
    }

    public function barcodes(): HasMany
    {
        return $this->hasMany(ProductBarcode::class);
    }

    public function unit(): HasOne
    {
        return $this->hasOne(ProductUnit::class);
    }

}
