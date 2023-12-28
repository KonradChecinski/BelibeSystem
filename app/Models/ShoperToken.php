<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoperToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'access_token',
        'token_type',
        'expires_in',
        'expires_at'
    ];
}
