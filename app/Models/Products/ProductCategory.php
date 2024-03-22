<?php

namespace App\Models\Products;

use App\Models\ClientDiscount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class ProductCategory extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'parent',
        'show_in_menu',
    ];

    protected $hidden = [
        'pivot'
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
//            ->skipGenerateWhen(fn() => $this->slug !== '');
            ->preventOverwrite();
    }


    public function productModels(): BelongsToMany
    {
        return $this->belongsToMany(ProductModel::class)->withTimestamps();
    }

    public function clientsDiscounts(): HasMany
    {
        return $this->hasMany(ClientDiscount::class);
    }
}
