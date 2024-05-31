<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class B2bPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'subiekt_id',
        'name',
        'type'
    ];

    public function clients(): BelongsToMany
    {
        return $this->belongsToMany(Client::class)->as('discount')->withPivot(["discount", "discount_value"])->withTimestamps();
    }
}
