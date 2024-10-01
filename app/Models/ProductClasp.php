<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductClasp extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'value',
    ];


    public function models(): HasMany
    {
        return $this->hasMany(ProductModel::class);
    }
}
