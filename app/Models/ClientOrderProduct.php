<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientOrderProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        "client_order_id",
        "product_id",
        "quantity",
        "price_net",
        "price_gross",
        "total_net",
        "total_gross",
    ];

    public function orders()
    {
        return $this->belongsTo(ClientOrder::class);
    }
}
