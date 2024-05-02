<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        "client_id",
        "number",
        "status",
        "payment_id",
        "delivery_id",
        "client_location_id",
        "total_quantity",
        "total_net",
        "total_gross",
        "discount",
        "discounted_total_net",
        "discounted_total_gross",
        "delivery_net",
        "delivery_gross",
        "currency",
        "comment",
        "subiekt_number",
        "subiekt_added_at",
    ];

//    status
//    1 złożone
//    2 zaakceptowane do realizacji
//    3 przesłane do subiekta
//    4 w trakcie kompletacji
//    5 zrealizowane
//    6 anulowane


    public function products(): HasMany
    {
        return $this->hasMany(ClientOrderProduct::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(B2bPayment::class);
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(B2bDelivery::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(ClientLocation::class, "client_location_id");
    }
}
