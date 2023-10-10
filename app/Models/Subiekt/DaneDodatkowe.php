<?php

namespace App\Models\Subiekt;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DaneDodatkowe extends Model
{
    use HasFactory;


    protected $primaryKey = 'pwd_Id';
    protected $table = 'pw_Dane';
    protected $connection = 'subiekt';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "pwd_TypObiektu",
        "pwd_IdObiektu",
        "pwd_IdPozycji",
        "pwd_Data01",
        "pwd_Data02",
        "pwd_Data03",
        "pwd_Data04",
        "pwd_Data05",
        "pwd_Data06",
        "pwd_Data07",
        "pwd_Data08",
        "pwd_Data09",
        "pwd_Data10",
        "pwd_Liczba01",
        "pwd_Liczba02",
        "pwd_Liczba03",
        "pwd_Liczba04",
        "pwd_Liczba05",
        "pwd_Liczba06",
        "pwd_Liczba07",
        "pwd_Liczba08",
        "pwd_Liczba09",
        "pwd_Liczba10",
        "pwd_Tekst01",
        "pwd_Tekst02",
        "pwd_Tekst03",
        "pwd_Tekst04",
        "pwd_Tekst05",
        "pwd_Tekst06",
        "pwd_Tekst07",
        "pwd_Tekst08",
        "pwd_Tekst09",
        "pwd_Tekst10",
        "pwd_Kwota01",
        "pwd_Kwota02",
        "pwd_Kwota03",
        "pwd_Kwota04",
        "pwd_Kwota05",
        "pwd_Kwota06",
        "pwd_Kwota07",
        "pwd_Kwota08",
        "pwd_Kwota09",
        "pwd_Kwota10",
        "pwd_Fk01",
        "pwd_Fk02",
        "pwd_Fk03",
        "pwd_Fk04",
        "pwd_Fk05",
        "pwd_Fk06",
        "pwd_Fk07",
        "pwd_Fk08",
        "pwd_Fk09",
        "pwd_Fk10",
        "pwd_Flaga01",
        "pwd_Flaga02",
        "pwd_Flaga03",
        "pwd_Flaga04",
        "pwd_Flaga05",
        "pwd_Flaga06",
        "pwd_Flaga07",
        "pwd_Flaga08",
        "pwd_Flaga09",
        "pwd_Flaga10",
    ];


    public static function findByTypAndFlaga($typName, $typValue, $flagaName, $flagaValue)
    {
        return DaneDodatkowe::Where($typName, "=", $typValue)->where($flagaName, $flagaValue)->get();
    }

    public static function magazynyStanow()
    {
        return DaneDodatkowe::Select("pwd_IdObiektu")->where("pwd_TypObiektu", "=", -150)->where("pwd_Flaga01", 1)->get();
    }
}
