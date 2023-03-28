<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductModelColor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_model_id',
        'name',
    ];




    public function model(): BelongsTo {
        return $this->belongsTo(ProductModel::class);
    }
    public function products(): HasMany {
        return $this->hasMany(Product::class);
    }
}
