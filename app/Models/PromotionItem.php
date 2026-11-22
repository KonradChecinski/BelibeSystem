<?php

namespace App\Models;

use App\Models\Products\Product;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionItem extends Model
{
    use HasFactory;

    // Hierarchia szczegółowości: Produkt (1) > Kolor (2) > Model (3) > Kategoria (4) > Grupa (5) > Marka (6) > Wszystko (7)
    public const TYPE_PRODUCT = 1;
    public const TYPE_COLOR = 2;
    public const TYPE_MODEL = 3;
    public const TYPE_CATEGORY = 4;
    public const TYPE_GROUP = 5;
    public const TYPE_BRAND = 6;
    public const TYPE_EVERYTHING = 7;

    protected $fillable = [
        'promotion_id',
        'type',
        'product_id',
        'product_model_color_id',
        'product_model_id',
        'product_category_id',
        'product_group_id',
        'product_brand_id',
    ];

    protected $casts = [
        'promotion_id' => 'integer',
        'type' => 'integer',
        'product_id' => 'integer',
        'product_model_color_id' => 'integer',
        'product_model_id' => 'integer',
        'product_category_id' => 'integer',
        'product_group_id' => 'integer',
        'product_brand_id' => 'integer',
    ];

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productModelColor(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, 'product_model_color_id');
    }

    public function productModel(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class);
    }

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function productGroup(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class);
    }

    public function productBrand(): BelongsTo
    {
        return $this->belongsTo(ProductBrand::class);
    }
}
