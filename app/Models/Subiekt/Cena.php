<?php

namespace App\Models\Subiekt;

use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductUnit;
use App\Models\SettingsDictionarySize;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cena extends Model
{
    use HasFactory;

    protected $primaryKey = 'tc_id';
    protected $table = 'tw_Cena';
    protected $connection= 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "tc_CenaNetto2",
        "tc_CenaBrutto2",
        "tc_CenaNetto3",
        "tc_CenaBrutto3",
    ];




    public function towar(): BelongsTo
    {
        return $this->belongsTo(Towar::class, "tc_IdTowar");
    }

}
