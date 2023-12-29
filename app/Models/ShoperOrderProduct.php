<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoperOrderProduct extends Model
{
    use HasFactory;


    protected $fillable = [
        'shoper_order_id',
        'code',
        'quantity',
        'price',
    ];

    public function shoperOrder(): BelongsTo
    {
        return $this->belongsTo(ShoperOrder::class);
    }
}
