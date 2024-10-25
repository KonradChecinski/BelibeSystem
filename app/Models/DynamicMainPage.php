<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicMainPage extends Model
{
    use HasFactory;

    protected $fillable = [
        "content",
        "zones"
    ];

    protected $casts = [
        "content" => "array", // "content" is a JSON field in the database, so we need to cast it to an array
        "zones" => "array", // "content" is a JSON field in the database, so we need to cast it to an array
    ];
}
