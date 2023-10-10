<?php

namespace App\Models\Products\Price;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductModelPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_model_id',
        'vat_rate',
        'wholesale_net_price',
        'wholesale_gross_price',
        'retail_net_price',
        'retail_gross_price',
        'currency'
    ];


    public function model(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, "product_model_id", "id");
    }
}
