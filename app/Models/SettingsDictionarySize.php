<?php

namespace App\Models;

use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SettingsDictionarySize extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function color(): hasMany
    {
        return $this->hasMany(Product::class, "id", "product_size_id");
    }

}
