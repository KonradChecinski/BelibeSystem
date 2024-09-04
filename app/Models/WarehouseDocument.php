<?php

namespace App\Models;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseDocument extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        "number",
        "status",
        "type",
        "client_order_id",
        "total_quantity",
        "total_net",
        "total_gross",
        "discount",
        "discounted_total_net",
        "discounted_total_gross",
        "client_comment",
        "user_comment"
    ];

    // status
    // 10 nowe
    // 50 kompletacja
    // 100 zrealizowane

    // type
    // 1 B2B
    // 2 B2C
    // 3 All

    public function warehouseDocumentProducts(): HasMany
    {
        return $this->hasMany(WarehouseDocumentProduct::class);
    }

    public function clientOrder()
    {
        return $this->belongsTo(ClientOrder::class);
    }


    public function products(): \Staudenmeir\EloquentHasManyDeep\HasManyDeep
    {
        return $this->hasManyDeep(Product::class, [WarehouseDocumentProduct::class],
            [
                'warehouse_document_id', // Foreign key on the "warehouse_document_products" table.
                'id',    // Foreign key on the "products" table.
            ],
            [
                'id', // Local key on the "warehouse_documents" table.
                'product_id', // Local key on the "warehouse_document_products" table.
            ]);
    }

    public function productModelColors()
    {
        return $this->hasManyDeep(ProductModelColor::class, [WarehouseDocumentProduct::class, Product::class],
            [
                'warehouse_document_id', // Foreign key on the "warehouse_document_products" table.
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
            ],
            [
                'id', // Local key on the "warehouse_documents" table.
                'product_id', // Local key on the "warehouse_document_products" table.
                'product_model_color_id', // Local key on the "products" table.
            ]);
    }

    public function productModels()
    {
        return $this->hasManyDeep(ProductModel::class, [WarehouseDocumentProduct::class, Product::class, ProductModelColor::class],
            [
                'warehouse_document_id', // Foreign key on the "warehouse_document_products" table.
                'id', // Foreign key on the "products" table.
                'id',    // Foreign key on the "product_model_colors" table.
                'id'     // Foreign key on the "product_models" table.
            ],
            [
                'id', // Local key on the "warehouse_documents" table.
                'product_id', // Local key on the "warehouse_document_products" table.
                'product_model_color_id', // Local key on the "products" table.
                'product_model_id'  // Local key on the "product_model_colors" table.
            ]);
    }
}
