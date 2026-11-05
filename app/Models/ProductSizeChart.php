<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductSizeChart extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'table_data',
        'tiktok_template_id',
        'tiktok_image_uri',
    ];

    protected $casts = [
        'table_data' => 'array',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(ProductModel::class, 'product_size_chart_id');
    }
}

