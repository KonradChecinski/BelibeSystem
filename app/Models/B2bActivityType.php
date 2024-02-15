<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class B2bActivityType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function clientsActivities(): HasMany
    {
        return $this->hasMany(ClientActivity::class);
    }
}
