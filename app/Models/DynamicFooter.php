<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicFooter extends Model
{
    use HasFactory;

    protected $fillable = [
        "content",
    ];

    protected $casts = [
        "content" => "array", // "content" is a JSON field in the database, so we need to cast it to an array
    ];
}
