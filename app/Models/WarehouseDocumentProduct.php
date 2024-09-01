<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseDocumentProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        "warehouse_document_id",
        "product_id",
        "product_code",
        "quantity",
        "original_price_net",
        "original_price_gross",
        "price_net",
        "price_gross",
        "currency",
    ];

    public function warehouseDocument(): BelongsTo
    {
        return $this->belongsTo(WarehouseDocument::class);
    }
}
