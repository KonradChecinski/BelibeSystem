<?php

namespace App\Models;

use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerSettlementItem extends Model
{
    use HasFactory;

    protected $fillable = [
        "partner_settlement_document_id",
        "product_id",
        "quantity",
        "price_net_original",
        "price_gross_original",
        "price_net_computed",
        "price_gross_computed",
        "price_net_final",
        "price_gross_final",
        "document_position",
    ];

    public function settlementDocument()
    {
        return $this->belongsTo(PartnerSettlementDocument::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }


}
