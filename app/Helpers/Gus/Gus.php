<?php

namespace App\Helpers\Gus;

use GusApi\Exception\NotFoundException;
use GusApi\GusApi;
use GusApi\RegonConstantsInterface;
use GusApi\ReportTypeMapper;
use GusApi\ReportTypes;
use Illuminate\Support\Str;

class Gus
{
    private static $instance;
    private GusApi $gus;
    private static string $sid;

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
        $userKey = config('services.gus.api_key');

        if ($userKey) {
            $this->gus = new GusApi($userKey,
                new \GusApi\Adapter\Soap\SoapAdapter(
                    RegonConstantsInterface::BASE_WSDL_URL,
                    RegonConstantsInterface::BASE_WSDL_ADDRESS
                )
            );
        } else {
            $this->gus = new GusApi('abcde12345abcde12345');
        }

        self::$sid = $this->gus->login();
        return $this;
    }

    public static function search($nip)
    {
        $instance = self::getInstance();
        try {
            $response = $instance->gus->getByNip(self::$sid, $nip);

            $company = $response[0];

            $mapper = new ReportTypeMapper();
            $reportType = $mapper->getReportType($company);
            $fullReport = $instance->gus->getFullReport(
                self::$sid,
                $company,
                $reportType
            )->dane;
//            dd($fullReport);

            if ($company->getType() === "p") {
                $buildingNumberObject = (array)($fullReport->praw_adSiedzNumerNieruchomosci);
                $apartmentNumberObject = (array)($fullReport->praw_adSiedzNumerLokalu);
            } else if ($company->getType() === "f") {
                $buildingNumberObject = (array)($fullReport->fiz_adSiedzNumerNieruchomosci);
                $apartmentNumberObject = (array)($fullReport->fiz_adSiedzNumerLokalu);
            } else {
                $buildingNumberObject = [];
                $apartmentNumberObject = [];
            }


            $street = $company->getStreet();
            $street = Str::replace("ul. ", "", $street, false);
            $street = Str::replace("al. ", "", $street, false);

            $result = (object)[
                "name" => Str::title($company->getName()),
                "nip" => $nip,
//                "regon" => $company->getRegon(),
                "voivodeship" => Str::title($company->getProvince()),
                "city" => $company->getCity(),
                "zipCode" => $company->getZipCode(),
                "street" => $street,
                "buildingNumber" => count($buildingNumberObject) > 0 ? $buildingNumberObject[0] : null,
                "apartmentNumber" => count($apartmentNumberObject) > 0 ? $apartmentNumberObject[0] : null,
            ];

        } catch (NotFoundException $e) {
            $result = $e->getMessage();
        }
        return $result;
    }

    public function __destruct()
    {
        $this->gus->logout(self::$sid);
    }

}
