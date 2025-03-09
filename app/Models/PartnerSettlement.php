<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        "partner_id",
        "user_id",
        "settlement_date",
        "sold_net",
        "sold_gross",
        "return_net",
        "return_gross",
        "total_net",
        "total_gross",
    ];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->hasMany(PartnerSettlementDocument::class);
    }
}
