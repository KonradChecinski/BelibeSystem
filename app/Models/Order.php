<?php

namespace App\Models;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        "number",
        "type",
        "status",
        "order_id",
        "ordered_at",
        "total_quantity",
        "total_gross",
        "payment_name",
        "delivery_name",
        "delivery_gross",
        "smart",
        "promo_code",
        "email",
        "login",
        "firstname",
        "lastname",
        "company",
        "city",
        "postcode",
        "street1",
        "country",
        "phone",
        "tax_id",
        "subiekt_id",
        "subiekt_number",
        "subiekt_added_at"
    ];
//    Typ
//1-shoper
//2-allegro

//    status
//    1 złożone
//    2 zaakceptowane do realizacji
//    3 w trakcie kompletacji
//    4 przesłane do subiekta
//    5 zrealizowane
//    6 anulowane
    public function orderProducts(): HasMany
    {
        return $this->hasMany(OrderProduct::class);
    }


    public function products(): \Staudenmeir\EloquentHasManyDeep\HasManyDeep
    {
        return $this->hasManyDeep(Product::class, [OrderProduct::class],
            [
                'order_id', // Foreign key on the "client_order_products" table.
                'id',    // Foreign key on the "products" table.
            ],
            [
                'id', // Local key on the "client_orders" table.
                'product_id', // Local key on the "client_order_products" table.
            ]);
    }

    public function productModelColors()
    {
        return $this->hasManyDeep(ProductModelColor::class, [OrderProduct::class, Product::class],
            [
                'order_id', // Foreign key on the "client_order_products" table.
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
            ],
            [
                'id', // Local key on the "client_orders" table.
                'product_id', // Local key on the "client_order_products" table.
                'product_model_color_id', // Local key on the "products" table.
            ]);
    }

    public function productModels()
    {
        return $this->hasManyDeep(ProductModel::class, [OrderProduct::class, Product::class, ProductModelColor::class],
            [
                'order_id', // Foreign key on the "client_order_products" table.
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
                'id'     // Foreign key on the "product_models" table.
            ],
            [
                'id', // Local key on the "client_orders" table.
                'product_id', // Local key on the "client_order_products" table.
                'product_model_color_id', // Local key on the "products" table.
                'product_model_id'  // Local key on the "product_model_colors" table.
            ]);
    }
}
