<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'activity_type_id',
        'date',
        'time',
        'description',
        'user_id',
    ];
}
