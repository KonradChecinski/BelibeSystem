<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Courier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tracking_url',
    ];

    protected $casts = [
        'supports_cod' => 'boolean',
        'allows_multiple_packages' => 'boolean',

        'weight_enabled' => 'boolean',
        'weight_required' => 'boolean',

        'width_enabled' => 'boolean',
        'width_required' => 'boolean',

        'height_enabled' => 'boolean',
        'height_required' => 'boolean',

        'depth_enabled' => 'boolean',
        'depth_required' => 'boolean',
    ];

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    public function b2bDeliveries(): HasMany
    {
        return $this->hasMany(B2bDelivery::class);
    }
}
