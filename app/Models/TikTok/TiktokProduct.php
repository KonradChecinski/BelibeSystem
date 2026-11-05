<?php

namespace App\Models\TikTok;

use App\Models\Products\ProductModelColor;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laraditz\TikTok\Models\TiktokProduct as BaseTiktokProduct;

class TiktokProduct extends BaseTiktokProduct
{
    protected $table = 'tiktok_products';

    protected $fillable = [
        'id',
        'shop_id',
        'product_model_color_id',
        'title',
        'status',
        'sync_status',
        'last_sync_error',
        'last_synced_at',
        'has_draft',
        'is_not_for_sale',
        'sales_regions',
        'audit',
        'create_time',
        'update_time',
    ];

    protected $casts = [
        'has_draft' => 'boolean',
        'is_not_for_sale' => 'boolean',
        'sales_regions' => 'json',
        'audit' => 'json',
        'last_synced_at' => 'datetime',
    ];

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, 'product_model_color_id');
    }

    public function skus(): HasMany
    {
        return $this->hasMany(TiktokProductSku::class, 'product_id', 'id');
    }
}

