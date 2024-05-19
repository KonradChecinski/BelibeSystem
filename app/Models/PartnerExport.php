<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerExport extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'type',
        'path',
        'cron',
        'completed_at',
    ];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    
}
