<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'unit',
        'size',
        'show_in_b2b',
        'show_in_b2c',
        'show_in_allegro',
        'show_in_subiekt',
        'description_b2b',
        'description_b2c',
        'description_allegro',
    ];

    public function color(): BelongsTo {
        return $this->belongsTo(ProductModelColor::class);
    }
    public function images(): HasMany {
        return $this->hasMany(ProductImage::class);
    }
    public function group(): BelongsTo {
        return $this->belongsTo(ProductGroup::class);
    }
    public function extraBarcodes(): HasMany {
        return $this->hasMany(ProductExtraBarcode::class);
    }

}
