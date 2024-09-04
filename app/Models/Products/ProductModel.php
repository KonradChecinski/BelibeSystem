<?php

namespace App\Models\Products;

use App\Helpers\PriceForClient\PriceForClient;
use App\Models\B2bCart;
use App\Models\B2cCategory;
use App\Models\B2cColor;
use App\Models\Client\Client;
use App\Models\ClientDiscount;
use App\Models\GS1Brand;
use App\Models\GS1GPC;
use App\Models\ProductBrand;
use App\Models\ProductColorIcon;
use App\Models\Products\Price\ProductModelPrice;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;

class ProductModel extends Model
{
    use HasFactory;
    use HasSlug;
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
        'name_6_char',
        'b2c_variant'
    ];

    protected $hidden = [
        'pivot'
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('symbol')
            ->saveSlugsTo('slug');
    }

//    Colors and products
    public function colors(): HasMany
    {
        return $this->hasMany(ProductModelColor::class);
    }

    public function colorsToB2b(): HasMany
    {
        return $this->hasMany(ProductModelColor::class)->whereHas("products", function (Builder $query) {
            $query->where("show_in_b2b", true);
        });
    }

    public function colorsWithIcons(): HasMany
    {
        return $this->hasMany(ProductModelColor::class)->with(["colorIcon"]);
    }

    public function colorsWithImages(): HasMany
    {
        return $this->hasMany(ProductModelColor::class)->with(["images", "colorIcon"]);
    }

    public function colorIcons(): HasManyThrough
    {
        return $this->hasManyThrough(ProductColorIcon::class, ProductModelColor::class, "product_model_id", "id", "id", "product_color_icon_id");
    }

    public function products(): HasManyDeep
    {
//        return $this->hasManyThrough(Product::class, ProductModelColor::class)->with(['barcodes', 'size', 'unit']);
        return $this->hasManyDeep(Product::class, [ProductModelColor::class])->with(['barcodes', 'size', 'unit']);
    }

    public function productsWithoutRelation(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, ProductModelColor::class);
    }

    public function productsToB2b(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, ProductModelColor::class)->with(['barcodes', 'size', 'unit'])->where("show_in_b2b", true);
    }

    public function productsToB2bWithoutRelation(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, ProductModelColor::class)->where("show_in_b2b", true);
    }

    public function productsToB2bWithRelation(): HasMany
    {
        return $this->colors()
            ->with("images", function ($query) {
                $query->where("type", 1);
            })
            ->withWhereHas("products", function ($query) {
                $query->where("show_in_b2b", true);
                $query->with(['barcodes', 'size', 'unit']);
            })
            ->with(["colorIcon"]);
    }

    public function barcodes(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->productsWithoutRelation(), (new Product())->barcodes());
    }

    public function prices(): HasOne
    {
        return $this->hasOne(ProductModelPrice::class);
    }

    public function quantityToB2b(): int
    {
        return $this->productsToB2bWithoutRelation->sum("quantity");
    }

    public function sizes(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->productsWithoutRelation(), (new Product())->size());
    }

    public function sizesToB2b(): HasManyDeep
    {
        return $this->hasManyDeepFromRelationsWithConstraints([$this, 'productsToB2bWithoutRelation'], [new Product(), 'size']);
    }


//    Images
    public function images(): HasManyThrough
    {
        return $this->hasManyThrough(ProductImage::class, ProductModelColor::class);
    }

    public function mainImage()
    {
        if ($this->images()->where("main", 1)->count() === 0) {
            return $this->images()->where("order", 0)->where("type", 1)->first();
        }
        return $this->images()->where("main", 1)->first();
    }

    public function mainImages()
    {
        $images = $this->images()->whereIn("main", [1, 2])->get();
        if ($images->count() === 0) {
            return $this->images()->where("order", 0)->where("type", 1)->limit(2)->get();
        }
        return $images;
    }


//    Products relations
    public function group(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class, "product_group_id");
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class)->withTimestamps();
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(ProductBrand::class, "product_brand_id");
    }

//    GS1
    public function gs1Brand(): BelongsTo
    {
        return $this->belongsTo(GS1Brand::class, "product_gs1_brand_id");
    }

    public function gs1Gpc(): BelongsTo
    {
        return $this->belongsTo(GS1GPC::class, "product_gs1_gpc_id");
    }

    public function b2cCategory(): BelongsTo
    {
        return $this->belongsTo(B2cCategory::class, "product_b2c_category_id");
    }

//    Client

    public function clientsDiscounts(): HasMany
    {
        return $this->hasMany(ClientDiscount::class);
    }

    public function priceForClientB2b(Client $client)
    {
        return PriceForClient::getPriceFromProductModel($this, $client);
    }

    public function priceForClientB2bWithExtraDiscount(Client $client, int $extraDiscountPercent)
    {
        return PriceForClient::getPriceFromProductModel($this, $client, $extraDiscountPercent);
    }

    public function favoritedClients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class, "favorite_product_model")->withTimestamps();
    }

    public function isFavoritedByClient($client)
    {
        return $this->favoritedClients()->where("client_id", $client->id)->exists();
    }

    public function carts()
    {
        return $this->hasManyDeepFromReverse(
            (new B2bCart())->productModel()
        );
    }

    public function clientsCart($client)
    {
        return $this->hasManyDeepFromReverse(
            (new B2bCart())->productModel()
        )->where("client_id", $client->id);
    }
}
