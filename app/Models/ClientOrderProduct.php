<?php

namespace App\Models;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientOrderProduct extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        "client_order_id",
        "product_id",
        "quantity",
        "price_net",
        "vat_rate",
        "currency",
    ];

    public function orders()
    {
        return $this->belongsTo(ClientOrder::class, "client_order_id");
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productModelColor()
    {
        return $this->hasOneDeep(ProductModelColor::class, [Product::class],
            [
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
            ],
            [
                'product_id', // Local key on the "client_order_products" table.
                'product_model_color_id', // Local key on the "products" table.
            ]);
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
                'product_id', // Local key on the "client_order_products" table.
                'product_model_color_id', // Local key on the "products" table.
                'product_model_id'  // Local key on the "product_model_colors" table.
            ]);
    }
}
