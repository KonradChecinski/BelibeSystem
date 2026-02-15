<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubiektReceivable extends Model
{
    use HasFactory;

    protected $primaryKey = 'nzf_Id';
    protected $table = 'Belibe_System_Naleznosci';
    protected $connection = 'subiekt';
    public $timestamps = false;

    protected $fillable = [
        "nzf_TypObiektu",
        "nzf_IdObiektu",
        "nzf_IdDokumentAuto",
        "nzf_Status",
        "nzf_Typ",
        "nzf_Korekta",
        "nzf_Nota",
        "Rozliczenie",
        "nzf_Data",
        "nzf_NumerPelny",
        "nzf_TerminPlatnosci",
        "nzf_DataOstatniejSplaty",
        "DniSpoznienia",
        "WartoscPierwotnaWaluta",
        "WartoscWaluta",
        "WartoscPierwotna",
        "Wartosc",
        "nzf_Zrodlo",
        "inkz_Status"
    ];


    public function client(): BelongsTo
    {
        $this->connection = "mysql";
        return $this->belongsTo(Client::class, "nzf_IdObiektu", "subiekt_id");
    }

    public function clientByBuyer(): BelongsTo
    {
        $this->connection = "mysql";
        return $this->belongsTo(Client::class, "nzf_IdObiektu", "buyer_subiekt_id");
    }
}
