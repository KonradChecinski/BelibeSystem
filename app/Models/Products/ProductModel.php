<?php

namespace App\Models\Products;

use App\Models\GS1Brand;
use App\Models\GS1GPC;
use App\Models\ProductBrand;
use App\Models\Products\Price\ProductModelPrice;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductModel extends Model
{
    use HasFactory;
    use \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "symbol",
        "name",
        "product_group_id",
        'description_b2b',
        'description_b2c',
        'description_allegro',
        'name_11_char',
        'name_6_char'
    ];

    public function colors(): HasMany
    {
        return $this->hasMany(ProductModelColor::class);
    }

    public function colorsWithImages(): HasMany
    {
        return $this->hasMany(ProductModelColor::class)->with("images");
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class, "product_group_id");
    }

    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, ProductModelColor::class)->with(['barcodes', 'size', 'unit']);
    }

    public function prices(): HasOne
    {
        return $this->hasOne(ProductModelPrice::class);
    }


    public function images(): HasManyThrough
    {
        return $this->hasManyThrough(ProductImage::class, ProductModelColor::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(ProductBrand::class, "product_brand_id");
    }

    public function gs1Brand(): BelongsTo
    {
        return $this->belongsTo(GS1Brand::class, "product_gs1_brand_id");
    }

    public function gs1Gpc(): BelongsTo
    {
        return $this->belongsTo(GS1GPC::class, "product_gs1_gpc_id");
    }
}
