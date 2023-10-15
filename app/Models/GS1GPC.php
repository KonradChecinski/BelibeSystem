<?php

namespace App\Models;

use App\Models\Products\ProductModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GS1GPC extends Model
{
    use HasFactory;

    protected $table = 'gs1_gpcs';


    protected $fillable = [
        'name',
        'value'
    ];

    public function models(): HasMany
    {
        return $this->hasMany(ProductModel::class);
    }
}
