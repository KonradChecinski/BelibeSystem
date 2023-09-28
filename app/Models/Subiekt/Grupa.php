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
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Grupa extends Model
{
    use HasFactory;

    protected $primaryKey = 'grt_Id';
    protected $table = 'sl_GrupaTw';
    protected $connection= 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "grt_Nazwa",
    ];




    public function towar(): HasMany
    {
        return $this->hasMany(Towar::class, "tw_IdGrupa", "grt_Id" );
    }


}
