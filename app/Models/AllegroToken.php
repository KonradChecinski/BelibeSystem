<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllegroToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'access_token',
        'token_type',
        'refresh_token',
        'expires_in',
        'expires_at'
    ];
}
