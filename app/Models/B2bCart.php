<?php

namespace App\Models;

use App\Models\Client\Client;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;

class B2bCart extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        'client_id',
        'product_id',
        'quantity',
        'price_net',
        'price_gross',
        'currency',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productModel()
    {
        return $this->hasOneDeep(ProductModel::class, [Product::class, ProductModelColor::class],
            [
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
                'id'     // Foreign key on the "product_models" table.
            ],
            [
                'product_id', // Local key on the "b2b_carts" table.
                'product_model_color_id', // Local key on the "products" table.
                'product_model_id'  // Local key on the "product_model_colors" table.
            ]);
    }


    public function productModelColor()
    {
        return $this->hasOneDeep(ProductModelColor::class, [Product::class],
            [
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
            ],
            [
                'product_id', // Local key on the "b2b_carts" table.
                'product_model_color_id', // Local key on the "products" table.
            ]);
    }
}
