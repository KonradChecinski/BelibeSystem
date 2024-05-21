<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        "type",
        "status",
        "order_id",
        "ordered_at",
        "sum",
        "payment_name",
        "shiping_name",
        "shipping_cost",
        "promo_code",
        "email",
        "adress_type",
        "firstname",
        "lastname",
        "company",
        "city",
        "postcode",
        "street1",
        "country",
        "phone",
        "tax_id",
        "subiekt_number",
        "subiekt_added_at"
    ];
//    Typ
//1-shoper
//2-allegro

//    status
//    1 złożone
//    2 zaakceptowane do realizacji
//    3 przesłane do subiekta
//    4 w trakcie kompletacji
//    5 zrealizowane
//    6 anulowane
    public function orderProducts(): HasMany
    {
        return $this->hasMany(OrderProduct::class);
    }
}
