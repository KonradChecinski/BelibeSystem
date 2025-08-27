<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'mailable_type', 'mailable_id',
        'notifiable_type', 'notifiable_id',
        'origin_type', 'origin_class',
        'from', 'to', 'cc', 'bcc', 'to_emails',
        'subject', 'body', 'headers', 'attachments',
        'size', 'message_id', 'sent_at',
    ];

    protected $casts = [
        'from' => 'array',
        'to' => 'array',
        'cc' => 'array',
        'bcc' => 'array',
        'headers' => 'array',
        'attachments' => 'array',
        'sent_at' => 'datetime',
    ];

    public function mailable()
    {
        return $this->morphTo();
    }

    public function notifiable()
    {
        return $this->morphTo();
    }
}
