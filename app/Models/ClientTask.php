<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'title',
        'text',
        'datetime',
        'done',
        'user_id',
    ];
    
    protected $casts = [
        'datetime' => 'datetime',
        'done' => 'datetime',
    ];


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
