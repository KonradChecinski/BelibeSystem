<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'from',
        'to',
        'cc',
        'bcc',
        'subject',
        'body',
        'attachments',
        'notifiable_id',
        'notifiable_type',
        'type',
        'class',
        'sent_at',
    ];

    protected $casts = [
        'from' => 'array',
        'to' => 'array',
        'cc' => 'array',
        'bcc' => 'array',
        'attachments' => 'array',
        'sent_at' => 'datetime',
    ];

    // relacja do modelu, który otrzymał maila (User/Client/itp.)
    public function notifiable()
    {
        return $this->morphTo();
    }
}
