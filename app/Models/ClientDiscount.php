<?php

namespace App\Models;

use App\Models\Client\Client;
use App\Models\Products\ProductCategory;
use App\Models\Products\ProductGroup;
use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function productModel(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class);
    }

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function productGroup(): BelongsTo
    {
        return $this->belongsTo(ProductGroup::class);
    }

    public function productBrand(): BelongsTo
    {
        return $this->belongsTo(ProductBrand::class);
    }
}
