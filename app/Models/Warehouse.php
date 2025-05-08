<?php

namespace App\Models;

use App\Models\Subiekt\Towar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'subiekt_id',
        'symbol',
        'name',
        'type',
    ];


    public function getQuantityFromSubiektWarehouse(Towar $towar)
    {
        $quantity = $towar->stanyWszystkie()->where('st_MagId', $this->subiekt_id)->get()->sum("st_Stan");

        return $quantity;
    }
}
