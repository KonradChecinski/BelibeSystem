<?php

namespace App\Models;

use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductB2cStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'create_in_empik',
        'update_in_empik'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

}
