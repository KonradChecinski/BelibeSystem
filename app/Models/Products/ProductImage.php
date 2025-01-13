<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class ProductImage extends Model
{
    use HasFactory, HasSlug;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'product_model_color_id',
        'order',
        'path_basic',
        'path_square',
        'path_webp',
        'path_thumb',
        'path_2x3',
        'width',
        'height',
        'type',
        'publish',
        'main'
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function () {
                return $this->model->symbol . "-" . uniqid('', true);
            })
            ->saveSlugsTo('slug')
//            ->skipGenerateWhen(fn() => $this->slug !== '')
            ->preventOverwrite();
    }


    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, "product_model_color_id", "id");
    }

    public function model(): HasOneThrough
    {
        return $this->hasOneThrough(ProductModel::class, ProductModelColor::class, "id", "id", "product_model_color_id", "product_model_id");
    }
}
