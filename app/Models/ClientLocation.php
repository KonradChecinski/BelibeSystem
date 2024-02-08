<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'country_id',
        'city',
        'street',
        'building_number',
        'apartment_number',
        'postal_code',
        'note',
        'active'
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(B2bCountry::class);
    }
}
