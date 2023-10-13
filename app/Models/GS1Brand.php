<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GS1Brand extends Model
{
    use HasFactory;

    protected $table = 'gs1_brands';

    protected $fillable = [
        'name',
    ];
}
