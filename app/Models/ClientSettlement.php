<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class ClientSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        "client_id", // nzf_IdObiektu
        "document_id", //nzf_IdDokumentAuto //null
        "subiekt_id", //nzf_Id
        "type", //1,2 - naleznosci, zobowiazania

        "number", //nzf_NumerPelny
        "settlement", //Rozliczenie //0,1,2
        "datetime", // nzf_Data
        "date_of_payment", // "nzf_TerminPlatnosci",
        "date_of_last_payment", // "nzf_DataOstatniejSplaty",
//        "days_of_delay", // "DniSpoznienia",
        "original_value", //  "WartoscPierwotna",
        "value", //    "Wartosc",
    ];

    protected $appends = ["days_of_delay"];

    protected $casts = [
        'datetime' => 'datetime:Y-m-d H:i:s',
        'date_of_payment' => 'date:Y-m-d',
        'date_of_last_payment' => 'date:Y-m-d',
    ];


    public function getDaysOfDelayAttribute()
    {
//        $originalValue = $this->original_value;
//        $actualValue = $this->value;

        $settlement = $this->settlement;

        $today = Carbon::now();
        $paymentDate = Carbon::parse($this->date_of_payment);
        $lastPaymentDate = Carbon::parse($this->date_of_last_payment);


        if ($settlement === 2) {
            if ($paymentDate->diffInDays($lastPaymentDate, false) > 0) {
                return $paymentDate->diffInDays($lastPaymentDate);
            }
        }

        if ($settlement === 1) {
            if ($paymentDate->diffInDays($today, false) > 0) {
                return $paymentDate->diffInDays($today);
            }
        }

        if ($settlement === 0) {
            if ($paymentDate->diffInDays($today, false) > 0) {
                return $paymentDate->diffInDays($today);
            }
        }

        return null;
    }


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, "client_id", "id");
    }
}
