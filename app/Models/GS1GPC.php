<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GS1GPC extends Model
{
    use HasFactory;

    protected $table = 'gs1_gpcs';


    protected $fillable = [
        'name',
        'value'
    ];
}
