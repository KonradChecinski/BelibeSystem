<?php

namespace App\Models\Subiekt;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Kontrahent extends Model
{

    protected $primaryKey = 'kh_Id';
    protected $table = 'kh__Kontrahent';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "kh_Symbol",
        "kh_Zablokowany",
        'kh_Rodzaj',
    ];

    protected $visible = [
        'kh_Id',
        'kh_Symbol',
        'adresGlowny',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('aktywny', function (Builder $builder) {
            $builder
                ->where('kh_Zablokowany', 0)
                ->whereIn('kh_Rodzaj', [0, 2]) //(0 - dost/odb; 1-dostawca; 2-odbiorca; 3-ani dostawca ani odbiorca)
                ->where('kh_Osoba', 0)
                ->where('kh_Jednorazowy', 0);
        });
    }

    public function adresyWszystkie(): HasMany
    {
        return $this->hasMany(KontrahentAdres::class, 'adr_IdObiektu', 'kh_Id');
    }

//    public function adresyGlowne(): HasMany
//    {
//        return $this->hasMany(KontrahentAdres::class, 'adr_IdObiektu', 'kh_Id')
//            ->where('adr_TypAdresu', 1);
//    }

    public function adresGlowny(): HasOne
    {
        return $this->hasOne(KontrahentAdres::class, 'adr_IdObiektu', 'kh_Id')
            ->where('adr_TypAdresu', 1);
    }

    public function client(): HasOne
    {
        return $this->hasOne(Client::class, 'subiekt_id', 'kh_Id');
    }
}
