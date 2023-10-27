<?php

namespace App\Singleton;

use Exception;
use stdClass;
use COM;

class SubiektDodatki
{
    private static $instance;
    protected $dodatki = null;


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

    public function create()
    {
        if (is_null($this->dodatki)) {
            try {
                $this->dodatki = new COM("InsERT.Dodatki") or die("Cannot create an Dodatki object");
            } catch (Exception $e) {
                if ($this->dodatki != null) $this->dodatki->Zakoncz();
                die($e);
            }
        }


        return $this->dodatki;
    }
}
