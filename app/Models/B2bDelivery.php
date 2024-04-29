<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B2bDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_net',
        'price_gross',
        'free_from',
        'active',
        'delivery_time_min',
        'delivery_time_max',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
    
}
