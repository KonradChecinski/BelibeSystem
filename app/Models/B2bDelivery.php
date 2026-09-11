<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class B2bDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'courier_id',
        'subiekt_id',
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

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

}
