<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class Install7Controller extends Controller
{
    public function install()
    {
        $klienci = DB::table("test.klienci")->get();


//        +"branza": "7"

//    }
//        dd($klienci);
        foreach ($klienci as $klient) {
            $country = 2;

            if ($klient->kraj == "Polska") {
                $country = 1;
            }

            $number_start = strrpos($klient->ulica, ' ') + 1; // +1 so we don't include the space in our result
            $number = substr($klient->ulica, $number_start);
            $street = substr($klient->ulica, 0, $number_start - 1);

            switch ($klient->status) {
                case 1:
                    $status = 2;
                    break;
                case 2:
                    $status = 3;
                    break;
                case 3:
                    $status = 1;
                    break;
                default:
                    $status = 1;
            }

            switch ($klient->zrodlo_pozyskania_klienta) {
                case 1:
                    $source = 2;
                    break;
                case 2:
                    $source = 3;
                    break;
                case 3:
                    $source = 3;
                    break;
                case 4:
                    $source = 1;
                    break;
                case 5:
                    $source = 1;
                    break;
                case 6:
                    $source = 4;
                    break;
                case 7:
                    $source = 3;
                    break;
            }

            switch ($klient->branza) {
                case 1:
                    $industry = 2;
                    break;
                case 2:
                    $industry = 1;
                    break;
                case 3:
                    $industry = 1;
                    break;
                case 4:
                    $industry = 1;
                    break;
                case 5:
                    $industry = 3;
                    break;
                case 6:
                    $industry = 1;
                    break;
                case 7:
                    $industry = 4;
                    break;
                case 8:
                    $industry = 1;
                    break;
                case 9:
                    $industry = 5;
                    break;
                case 10:
                    $industry = 6;
                    break;
                case 11:
                    $industry = 4;
                    break;
                case 12:
                    $industry = 4;
                    break;

            }

            $klientInSubiekt = DB::connection("subiekt")->table("adr__Ewid")
                ->where("adr_NIP", $klient->nip)
                ->where("adr_TypAdresu", 1)->first();
//            dd($klientInSubiekt, );

            $client = Client::create([
                'subiekt_id' => $klientInSubiekt ? $klientInSubiekt->adr_IdObiektu : null,
                'name' => $klient->nazwa,
                'street' => $street,
                'city' => $klient->miasto,
                'postal_code' => $klient->kod,
                'country_id' => $country,
                'building_number' => $number,
                'apartment_number' => null,
                'phone' => $klient->tel1 ? (int)filter_var($klient->tel1, FILTER_SANITIZE_NUMBER_INT) : "brak",
                'email' => $klient->email ? $klient->email : "brak",
                'nip' => $klient->nip,
                'blacklist' => $klient->czarna_lista,
                'newsletter' => 0,
                'user_id' => 3,
                'status_id' => $status,
                'priority' => 1,
                'source_of_acquisition_id' => $source,
                'industry_id' => $industry,
            ]);

        }

        return ("OK");
    }
}
