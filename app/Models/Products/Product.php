<?php

namespace App\Models\Products;

use App\Models\B2bCart;
use App\Models\Client\Client;
use App\Models\ClientOrderProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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
        'subiekt_id',
        'symbol',
        'name',
        'quantity',
        'quantity_total',
        'product_unit_id',
        'product_size_id',
        'show_in_b2b',
        'show_in_b2c',
        'show_in_allegro',
        'show_in_subiekt',
    ];

    protected function quantity(): Attribute
    {
        return new Attribute(
            get: function (string $value, array $attributes) {
//                dd($attributes);

                $baseQuantity = $value;
                $orderProductsQuantity = ClientOrderProduct::query()->where("product_id", $attributes["id"])->whereHas("orders", function (Builder $query) {
                    $query->whereIn("status", [1, 2, 3, 4]);
                })->sum("quantity");
                $sum = $baseQuantity - $orderProductsQuantity;
                if ($sum < 0) {
                    return 0;
                }
                return $sum;
            }
        );
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, "product_model_color_id", "id");
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(ProductSize::class, "product_size_id", "id");
    }

    public function images(): hasManyThrough
    {
        return $this->hasManyThrough(ProductImage::class, ProductModelColor::class, "id",
            "product_model_color_id", "product_model_color_id", "id");
    }

    public function barcodes(): HasMany
    {
        return $this->hasMany(ProductBarcode::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ProductUnit::class, "product_unit_id", "id");
    }

    public function model(): BelongsTo
    {
        return $this->color->model();
    }


    public static function findBySubiektId($id)
    {

        if ($id == null) throw (new ModelNotFoundException)->setModel(Product::class);

//        return Product::Where("subiekt_id", "=", $id)->firstOrFail();
        return Product::Where("subiekt_id", "=", $id)->first();

    }

    public function inClientsCart(): HasMany
    {
        return $this->hasMany(B2bCart::class);
    }
}
