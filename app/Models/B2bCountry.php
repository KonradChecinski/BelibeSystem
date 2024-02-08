<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class B2bCountry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, "country_id");
    }

    public function clientsLocations(): HasMany
    {
        return $this->hasMany(ClientLocation::class, "country_id");
    }

    public function clientsRecipients(): HasMany
    {
        return $this->hasMany(ClientRecipient::class, "country_id");
    }
}
