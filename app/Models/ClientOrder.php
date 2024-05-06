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

class ClientOrder extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        "client_id",
        "number",
        "status",
        "payment_id",
        "delivery_id",
        "client_location_id",
        "total_quantity",
        "total_net",
        "total_gross",
        "discount",
        "discounted_total_net",
        "discounted_total_gross",
        "delivery_net",
        "delivery_gross",
        "currency",
        "comment",
        "subiekt_number",
        "subiekt_added_at",
    ];

//    status
//    1 złożone
//    2 zaakceptowane do realizacji
//    3 przesłane do subiekta
//    4 w trakcie kompletacji
//    5 zrealizowane
//    6 anulowane


    public function orderProducts(): HasMany
    {
        return $this->hasMany(ClientOrderProduct::class);
    }

    public function products(): \Staudenmeir\EloquentHasManyDeep\HasManyDeep
    {
        return $this->hasManyDeep(Product::class, [ClientOrderProduct::class],
            [
                'client_order_id', // Foreign key on the "client_order_products" table.
                'id',    // Foreign key on the "products" table.
            ],
            [
                'id', // Local key on the "client_orders" table.
                'product_id', // Local key on the "client_order_products" table.
            ]);
    }

    public function productModelColors()
    {
        return $this->hasManyDeep(ProductModelColor::class, [ClientOrderProduct::class, Product::class],
            [
                'client_order_id', // Foreign key on the "client_order_products" table.
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
        return $this->hasManyDeep(ProductModel::class, [ClientOrderProduct::class, Product::class, ProductModelColor::class],
            [
                'client_order_id', // Foreign key on the "client_order_products" table.
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


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(B2bPayment::class);
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(B2bDelivery::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(ClientLocation::class, "client_location_id");
    }
}
