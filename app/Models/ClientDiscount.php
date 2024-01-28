<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientDiscount extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'type',
        'product_model_id',
        'product_category_id',
        'product_group_id',
        'product_brand_id',
        'value',
    ];
}
