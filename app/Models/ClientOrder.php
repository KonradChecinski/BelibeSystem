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
        "total_net",
        "total_gross",
        "total_quantity",
        "comment",
    ];

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
