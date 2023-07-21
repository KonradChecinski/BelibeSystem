<?php

namespace App\Models\Products\Price;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'vat_rate',
        'wholesale_net_price',
        'wholesale_gross_price',
        'retail_net_price',
        'retail_gross_price',
    ];
}
