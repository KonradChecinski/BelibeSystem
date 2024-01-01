<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShoperOrder extends Model
{
    use HasFactory;

    protected $fillable = [
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

    public function shoperOrderProducts(): HasMany
    {
        return $this->hasMany(ShoperOrderProduct::class);
    }
}
