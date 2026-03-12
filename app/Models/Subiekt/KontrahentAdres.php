<?php

namespace App\Models\Subiekt;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KontrahentAdres extends Model
{

    protected $primaryKey = 'adr_Id';
    protected $table = 'adr__Ewid';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "adr_IdObiektu",
        "adr_TypAdresu",
        "adr_Nazwa",
        "adr_NazwaPelna",
        "adr_Telefon",
        "adr_Ulica",
        "adr_NrDomu",
        "adr_NrLokalu",
        "adr_Adres",
        "adr_Kod",
        "adr_Miejscowosc",
        "adr_IdWojewodztwo",
        "adr_IdPanstwo",
        "adr_NIP",
        "adr_Gmina",
        "adr_Powiat",
    ];

    protected $visible = [
        "adr_IdObiektu",
        "adr_TypAdresu",
        "adr_Nazwa",
        "adr_NazwaPelna",
        "adr_Telefon",
        "adr_Ulica",
        "adr_NrDomu",
        "adr_NrLokalu",
        "adr_Adres",
        "adr_Kod",
        "adr_Miejscowosc",
        "adr_IdWojewodztwo",
        "adr_IdPanstwo",
        "adr_NIP",
        "adr_Gmina",
        "adr_Powiat",
    ];

    public function kontrahent(): BelongsTo
    {
        return $this->belongsTo(Kontrahent::class, 'adr_IdObiektu', 'kh_Id');
    }
}
