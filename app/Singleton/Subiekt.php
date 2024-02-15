<?php

namespace App\Singleton;

use Exception;
use stdClass;
use COM;

class Subiekt
{
    private static $instance;
    protected $subiekt = null;


    public function __construct()
    {

    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function connect()
    {
        if (is_null($this->subiekt)) {
            try {
                $connS = new COM('Insert.gt') or die('Cannot create an InsERT GT object');
                $dodatki = new COM("InsERT.Dodatki") or die("Cannot create an Dodatki object");
                $connS->Produkt = 1;

                $connS->Autentykacja = 0;
                $connS->Serwer = env('DB_SUBIEKT_HOST');
                $connS->Uzytkownik = env('DB_SUBIEKT_USERNAME');
                $connS->UzytkownikHaslo = env('DB_SUBIEKT_PASSWORD');

                $connS->Baza = env('DB_SUBIEKT_DATABASE');
                $connS->Operator = env('SUBIEKT_OPERATOR_LOGIN');
                $connS->OperatorHaslo = $dodatki->Szyfruj(env('SUBIEKT_OPERATOR_PASSWORD'));
                $this->subiekt = $connS->Uruchom(0, 1);
                $this->subiekt->MagazynId = 1;
//                $this->subiekt->Okno->Widoczne = True;
            } catch (Exception $e) {
                if ($this->subiekt != null) $this->subiekt->Zakoncz();
                die($e);
            }
        }


        return $this->subiekt;
    }
}
