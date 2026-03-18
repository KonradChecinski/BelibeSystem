<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerSettlementDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        "partner_settlement_id",
        "client_invoice_id",
        "type",
        "document_subiekt_id",
        "document_name",
        "to_document_subiekt_id",
        "to_document_name",
        "quantity",
        "price_net_original",
        "price_gross_original",
        "price_net_computed",
        "price_gross_computed",
        "price_net_final",
        "price_gross_final",
        "status",
    ];


    public function settlement(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PartnerSettlement::class, 'partner_settlement_id');
    }

    public function items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PartnerSettlementItem::class);
    }

    public function clientInvoice()
    {
        return $this->belongsTo(ClientInvoice::class);
    }
}
