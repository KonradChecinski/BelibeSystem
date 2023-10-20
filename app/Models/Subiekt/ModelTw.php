<?php

namespace App\Models\Subiekt;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ModelTw extends Model
{
    use HasFactory;

    protected $primaryKey = 'mdt_Id';
    protected $table = 'sl_ModelTw';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "mdt_Id",
        "mdt_Nazwa"
    ];


    public function towar(): BelongsToMany
    {
        return $this->belongsToMany(Towar::class, "sl_ModelTowar", "mtw_IdModel", "mtw_IdTowar");
    }


    public static function findByName($name)
    {
        return ModelTw::Where("mdt_Nazwa", "=", $name)->first();
    }
}
