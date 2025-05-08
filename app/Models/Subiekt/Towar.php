<?php

namespace App\Models\Subiekt;

use App\Models\Products\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Towar extends Model
{
    use HasFactory;

    protected $primaryKey = 'tw_Id';
    protected $table = 'tw__Towar';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "tw_Zablokowany",
        "tw_Rodzaj",
        "tw_Symbol",
        "tw_Nazwa",
        "tw_Opis",
        "tw_Pole1",
        "tw_Pole2",
        "tw_Pole3",
        "tw_Pole4",
        "tw_Pole5",
        "tw_Pole6",
        "tw_Pole7",
        "tw_Pole8",
        "tw_Charakter",
        "tw_UrzNazwa",
        "tw_PodstKodKresk",
        "tw_KodUProducenta",
        "tw_IdGrupa",
        "tw_WWW",
        "tw_SklepInternet",
        "tw_SerwisAukcyjny",
        "tw_SprzedazMobilna",
    ];


    public function cena(): HasOne
    {
        return $this->hasOne(Cena::class, "tc_IdTowar", "tw_Id");
    }

    public function stany(): HasMany
    {
        return $this->hasMany(Stany::class, "st_TowId", "tw_Id")->whereIn("st_MagId", Warehouse::query()->where("type", 1)->pluck("subiekt_id"));
    }

    public function stanySklepy(): HasMany
    {
        return $this->hasMany(Stany::class, "st_TowId", "tw_Id")->whereIn("st_MagId", Warehouse::query()->where("type", 2)->pluck("subiekt_id"));
    }

    public function stanyWszystkie(): HasMany
    {
        return $this->hasMany(Stany::class, "st_TowId", "tw_Id");
    }

    public function stanyMagazyn($magazynId): HasMany
    {
        return $this->hasMany(Stany::class, "st_TowId", "tw_Id")->where("st_MagId", $magazynId);
    }

    public function grupa(): BelongsTo
    {
        return $this->belongsTo(Grupa::class, "tw_IdGrupa", "grt_Id");
    }

    public function model(): BelongsToMany
    {
        return $this->belongsToMany(ModelTw::class, "sl_ModelTowar", "mtw_IdTowar", "mtw_IdModel");
    }

    public function product()
    {
        return $this->hasOne(Product::class, 'subiekt_id', 'tw_Id');
    }

}
