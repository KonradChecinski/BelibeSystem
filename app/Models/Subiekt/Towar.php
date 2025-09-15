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
use Illuminate\Support\Facades\DB;

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

    /**
     * Zwraca sumę ob_IloscMag z vwZstWydWgKhnt dla wskazanego magazynu (odbiorcy)
     * i bieżącego towaru (tw_Id), przy statusie dokumentu = 4 (wywołane tylko na magazynie źródłowym) oraz
     * dbo.fnMAKE_DOKPARAM(dok_Typ, dok_Podtyp) = 589824 (MM).
     *
     * Odpowiada zapytaniu:
     * SELECT SUM(ob_IloscMag)
     * FROM vwZstWydWgKhnt
     * WHERE dok_Status = 4
     *   AND dbo.fnMAKE_DOKPARAM(dok_Typ, dok_Podtyp) = 589824
     *   AND dok_OdbiorcaId = :magazynId
     *   AND ob_TowId = :tw_Id
     * GROUP BY ob_TowId
     */
    public function sumObIloscMagForWarehouse(int $magazynId): float
    {
        $sum = DB::connection('subiekt')
            ->table('vwZstWydWgKhnt')
            ->where('dok_Status', 4) // równoważne warunkom: dok_Status <> 2 oraz dok_Status = 4
            ->whereRaw('dbo.fnMAKE_DOKPARAM(dok_Typ, dok_Podtyp) = ?', [589824])
            ->where('dok_OdbiorcaId', $magazynId)
            ->where('ob_TowId', $this->tw_Id)
            ->sum('ob_IloscMag');

//        $sql = $query->toSql();
//        $bindings = $query->getBindings();
//        $compiled = Str::replaceArray('?', collect($bindings)->map(function ($b) {
//            if (is_null($b)) return 'null';
//            if (is_numeric($b)) return (string)$b;
//            // proste quoting dla podglądu
//            return "'" . str_replace("'", "''", (string)$b) . "'";
//        })->all(), $sql);
//
//        dd([
//            'connection' => 'subiekt',
//            'sql' => $sql,
//            'compiled_sql' => $compiled,
//            'bindings' => $bindings,
//        ]);

        return (float)$sum;
    }

}
