<?php

namespace App\Helpers\Gus;

use GusApi\Adapter\Soap\SoapAdapter;
use GusApi\Client\SoapClient;
use GusApi\GusApi;
use GusApi\RegonConstantsInterface;

class Gus
{
    private static $instance;
    private GusApi $gus;

    private function __construct()
    {
    } //Singleton

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
            self::$instance->login();
        }
        return self::$instance;
    }

    public function login()
    {
        $this->gus = new GusApi('abcde12345abcde12345');
        $this->gus->login();
//        $gus = new GusApi('your api key here');
        return $this;
    }

    public static function search($nip)
    {
//        dd('search');
        $instance = self::getInstance();
        $result = $instance->gus->getByNip($nip);
        return $result;
    }

}
