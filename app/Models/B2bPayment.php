<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class B2bPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type'
    ];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, "payment_id");
    }
}
