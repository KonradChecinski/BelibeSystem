<?php

namespace App\Models\TikTok;

use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laraditz\TikTok\Models\TiktokProductSku as BaseTiktokProductSku;

class TiktokProductSku extends BaseTiktokProductSku
{
    protected $table = 'tiktok_product_skus';

    protected $fillable = [
        'id',
        'product_id',
        'local_product_id',
        'seller_sku',
        'inventory',
        'last_synced_quantity',
        'price',
        'status_info',
    ];

    protected $casts = [
        'inventory' => 'json',
        'price' => 'json',
        'status_info' => 'json',
        'last_synced_quantity' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(TiktokProduct::class, 'product_id', 'id');
    }

    public function localProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'local_product_id', 'id');
    }
}

