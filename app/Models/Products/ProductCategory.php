<?php

namespace App\Models\Products;

use App\Models\ClientDiscount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent',
        'show_in_menu',
    ];

    public function productModels(): BelongsToMany
    {
        return $this->belongsToMany(ProductModel::class);
    }

    public function clientsDiscounts(): HasMany
    {
        return $this->hasMany(ClientDiscount::class);
    }
}
