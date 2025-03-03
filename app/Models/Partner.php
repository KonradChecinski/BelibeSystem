<?php

namespace App\Models;

use App\Models\Client\Client;
use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'client_id',
        'warehouse_id',
        'subiekt_category_id',
    ];


    public function partnerExports()
    {
        return $this->hasMany(PartnerExport::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class)->withTimestamps();
    }

    public function partnerSettlements()
    {
        return $this->hasMany(PartnerSettlement::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

}
