<?php

namespace App\Models;

use App\Models\Subiekt\Towar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'subiekt_id',
        'symbol',
        'name',
        'type',
    ];


    public function getQuantityFromSubiektWarehouse(Towar|int $towar)
    {
        if (is_int($towar)) {
            // jeśli $towar jest int, prawdopodobnie trzeba będzie pobrać obiekt Towar
            $towar = Towar::find($towar);
        }

        $quantity = $towar->stanyWszystkie()->where('st_MagId', $this->subiekt_id)->get()->sum("st_Stan");

        $quantityOnMmDocumentWithEffectOnSourceWarehouse = $towar->sumObIloscMagForWarehouse($this->subiekt_id);


        return [
            "quantity" => $quantity,
            "currently_in_delivery" => $quantityOnMmDocumentWithEffectOnSourceWarehouse,
        ];
    }
}
