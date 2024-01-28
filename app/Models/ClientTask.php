<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'title',
        'text',
        'date',
        'time',
        'user_id',
    ];
}
