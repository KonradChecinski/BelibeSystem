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
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

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
        "user_comment",
        "client_comment",
        "subiekt_id",
        "subiekt_number",
        "subiekt_added_at",
        // polymorphic: who placed the order (user or client)
        "placed_by_type",
        "placed_by_id",
    ];

//Stare statusy:
//    0 - anulowane
//    1 - złożone
//    20 - zaakceptowane do realizacji
//    50 - przekazane do magazynu
//    55 - w trakcie kompletacji
//    60 - skompletowane
//    90 - przesłane do subiekta
//    100 - zrealizowane

//Nowe statusy:
//    0 - anulowane
//    1 - złożone
//    20 - zaakceptowane do realizacji
//    50 - przekazane do magazynu
//    55 - w trakcie kompletacji
//    60 - skompletowane
//    70 - przesłane do subiekta
//    80 - do nadania
//    85 - utworzona paczka
//    90 - pobrana etykieta
//    100 - zrealizowane


    public function orderProducts(): HasMany
    {
        return $this->hasMany(ClientOrderProduct::class);
    }

    public function warehouseDocument(): HasOne
    {
        return $this->hasOne(WarehouseDocument::class);
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

    public function invoice(): HasOne
    {
        return $this->hasOne(ClientInvoice::class);
    }

    public function shipments(): MorphMany
    {
        return $this->morphMany(Shipment::class, 'orderable');
    }

    /**
     * Who placed the order (User or ClientUser) - polymorphic relation
     */
    public function placedBy(): MorphTo
    {
        return $this->morphTo();
    }
}
