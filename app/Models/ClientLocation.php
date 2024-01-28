<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
