<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'courier_id',
        'recipient_country',
        'recipient_name',
        'recipient_company',
        'recipient_street',
        'recipient_building_number',
        'recipient_apartment_number',
        'recipient_postal_code',
        'recipient_city',
        'recipient_point',
        'recipient_phone',
        'recipient_email',
        'tracking_number',
        'package_count',
        'service',
        'service_code',
    ];

    protected $casts = [
        'package_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }


    public function orderable(): MorphTo
    {
        return $this->morphTo();
    }

    public function packages(): HasMany
    {
        return $this->hasMany(ShipmentPackage::class);
    }
}
