<?php

namespace App\Traits;

use App\Models\EmailLog;

trait HasEmailHistory
{
// Użycie: $this->morphMany(EmailLog::class, 'mailable')->latest()
    public function emailLogs()
    {
        return $this->morphMany(EmailLog::class, 'notifiable')->latest();
    }
}
