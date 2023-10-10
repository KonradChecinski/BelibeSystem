<?php

namespace App\Models\Subiekt;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stany extends Model
{
    use HasFactory;

    protected $primaryKey = 'st_TowId';
    protected $table = 'tw_Stan';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "st_MagId",
        "st_Stan",
        "st_StanRez",
    ];

    protected $hidden = [
        "st_StanMin",
        "st_StanMax"
    ];


    public function towar(): BelongsTo
    {
        return $this->belongsTo(Towar::class, "tc_IdTowar");
    }


}
