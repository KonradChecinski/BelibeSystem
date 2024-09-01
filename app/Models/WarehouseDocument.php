<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseDocument extends Model
{
    use HasFactory;

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
        "comment"
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
}
