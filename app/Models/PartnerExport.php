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
        'availability',
        'ean',
        'wholesale_net_price',
        'retail_gross_price',
        'description',
        'image_basic',
        'image_square',
        'image_webp',
        'path',
        'cron',
        'completed_at',
    ];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }


}
