<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\ProductEmpikCategory;


class Install9Controller extends Controller
{
    public function install()
    {
        ProductEmpikCategory::create(["name" => "Buty/Chłopiec/Dziecko/Klapki"]);
        ProductEmpikCategory::create(["name" => "Buty/Dziewczynka/Dziecko/Klapki"]);
        ProductEmpikCategory::create(["name" => "Buty/Kobieta/Buty Sportowe/Buty do sportów wodnych"]);
        ProductEmpikCategory::create(["name" => "Buty/Kobieta/Klapki"]);
        ProductEmpikCategory::create(["name" => "Buty/Mężczyzna/Buty Sportowe/Buty do sportów wodnych"]);
        ProductEmpikCategory::create(["name" => "Buty/Mężczyzna/Klapki"]);
        ProductEmpikCategory::create(["name" => "Buty/Unisex/Dziecko/Klapki"]);
        ProductEmpikCategory::create(["name" => "Lifestyle/Tekstylia/Tekstylia łazienkowe/Ręczniki"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Czepki"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Nauka pływania"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Noski"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Okularki"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Ręczniki szybkoschnące"]);
        ProductEmpikCategory::create(["name" => "Sport i rekreacja/Sporty wodne/Pływanie/Stroje kąpielowe"]);
        ProductEmpikCategory::create(["name" => "Ubrania/Chłopiec/Dziecko (92 cm - 164 cm)/Kąpielówki"]);
        ProductEmpikCategory::create(["name" => "Ubrania/Dziewczynka/Dziecko (92 cm - 164 cm)/Stroje Kąpielowe"]);
        ProductEmpikCategory::create(["name" => "Ubrania/Kobieta/Bluzki i tuniki/Tuniki"]);
        ProductEmpikCategory::create(["name" => "Ubrania/Kobieta/Stroje kąpielowe i kostiumy"]);
        ProductEmpikCategory::create(["name" => "Ubrania/Mężczyzna/Kąpielówki"]);

        return ("OK");
    }
}
