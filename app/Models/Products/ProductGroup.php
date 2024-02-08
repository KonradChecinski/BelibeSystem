<?php

namespace App\Models\Products;

use App\Models\ClientDiscount;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductGroup extends Model
{
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(ProductModel::class);
    }

    public function clientsDiscounts(): HasMany
    {
        return $this->hasMany(ClientDiscount::class);
    }
}
