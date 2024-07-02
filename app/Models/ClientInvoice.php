<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientInvoice extends Model
{
    use HasFactory;


    protected $fillable = [
        'client_id',
        'client_order_id',
        'type',
        'number',
        'net_value',
        'gross_value',
        'datetime',
        'status',
        'downloaded_at',
        'path',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'downloaded_at' => 'datetime',
    ];

    //Type
    //1 - Faktura
    //2 - Paragon
    //3 - Faktura korygująca


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function clientOrder(): BelongsTo
    {
        return $this->belongsTo(ClientOrder::class);
    }
}
