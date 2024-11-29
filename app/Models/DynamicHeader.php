<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicHeader extends Model
{
    use HasFactory;

    protected $fillable = [
        'order',
        'name',
        'route',
        'parameters',
    ];

    protected $casts = [
        'parameters' => 'array',
    ];
}
