<?php

namespace App\Models\Client;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'subiekt_id',
        'name',
        'nip',
        'country_id',
        'city',
        'street',
        'building_number',
        'apartment_number',
        'postal_code',
        'phone',
        'email',
        'status_id',
        'priority',
        'source_of_acquisition_id',
        'user_id',
        'payment_id',
        'blacklist',

    ];


}
