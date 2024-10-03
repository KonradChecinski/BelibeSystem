<?php

namespace App\Jobs\ToSubiekt;

use App\Models\Order;
use App\Models\Products\Product;
use App\Models\ShoperOrder;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class OrderCreateInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('sfera');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $orders = Order::where('subiekt_added_at', null)->where("status", 20)->get();// do zmiany na 60

//        dd($orders);
        foreach ($orders as $order) {
            $orderProducts = $order->orderProducts;

            $number = $order->number . " - ";
            if ($order->login !== null) {
                $number .= $order->login;
            } else {
                $number .= Str::ascii($order['firstname']) . " " . Str::ascii($order['lastname']);
            }
            $number = mb_substr($number, 0, 30);


            $zamowienie = $subiekt->SuDokumentyManager->DodajZK();
            $zamowienie->NumerOryginalny = $number;
            $zamowienie->LiczonyOdCenBrutto = true;
            $zamowienie->PoziomCenyId = 3;
            $zamowienie->Pozycje->PrzeliczWedlugPoziomuCen();


            switch ($order->type) {
                case 1: //SHOPER
                    $zamowienie->KategoriaId = 115;
                    $zamowienie->PlatnoscKartaId = 15;
                    break;

                case 2: //ALLEGRO
                    $zamowienie->KategoriaId = 35;
                    if ($order->payment_name == "P24") $zamowienie->PlatnoscKartaId = 16;
                    if ($order->payment_name == "PAYU") $zamowienie->PlatnoscKartaId = 19;
                    break;

                case 3: //EMPIK
                    $zamowienie->KategoriaId = 190;
                    $zamowienie->PlatnoscKartaId = 20;
                    break;
            }


            foreach ($orderProducts as $orderProduct) {
                if ($orderProduct->product_id != null) {
                    $productSubiektId = Product::find($orderProduct->product_id)->subiekt_id;
                    $productDescription = $orderProduct->product_code;
                } else {
                    $productSubiekt = Towar::where("tw_Symbol", $orderProduct->product_code)->first();
                    $productSubiektId = is_null($productSubiekt) ? null : $productSubiekt->tw_Id;
                }


                if (is_null($productSubiektId)) {
                    $pozycja = $zamowienie->Pozycje->DodajUslugeJednorazowa();
                    $pozycja->UslJednNazwa = substr($orderProduct["product_code"], 0, 50);
                    $pozycja->Opis = Str::ascii("Usługa jednorazowa");
                    $pozycja->IloscJm = (float)$orderProduct['quantity'];
                    $pozycja->CenaBruttoPrzedRabatem = (float)$orderProduct['price'];
//                    $pozycja->RabatProcent = (float)0;
                    $pozycja->CenaBruttoPoRabacie = (float)$orderProduct['discounted_price'];
                } else {
                    $pozycja = $zamowienie->Pozycje->Dodaj((int)$productSubiektId);
                    $pozycja->Opis = Str::ascii($productDescription);
                    $pozycja->IloscJm = (float)$orderProduct['quantity'];
                    $pozycja->CenaBruttoPrzedRabatem = (float)$orderProduct['price'];
//                    $pozycja->RabatProcent = (float)0;
                    $pozycja->CenaBruttoPoRabacie = (float)$orderProduct['discounted_price'];
                }
            }

            if ($order["delivery_gross"] != 0.0) {
                $pozycja = $zamowienie->Pozycje->DodajUslugeJednorazowa();
                $pozycja->UslJednNazwa = substr($order["delivery_name"], 0, 50);
                $pozycja->Opis = mb_convert_encoding("Usługa jednorazowa", 'iso-8859-2', 'utf-8');
                $pozycja->IloscJm = (float)1;
                $pozycja->CenaBruttoPrzedRabatem = (float)$order['delivery_gross'];
                $pozycja->RabatProcent = (float)0;
            }


            $zamowienie->PlatnoscKartaKwota = $zamowienie->KwotaDoZaplaty;


            switch ($order->type) {
                case 1: //SHOPER
                    $zamowienie->KontrahentId = 1439;
                    $zamowienie->Wystawil = "Shoper";
                    break;

                case 2: //ALLEGRO
                    $zamowienie->KontrahentId = 1089;
                    $zamowienie->Wystawil = "Allegro";
                    break;

                case 1: //EMPIK
                    $zamowienie->KontrahentId = 880;
                    $zamowienie->Wystawil = "Empik";
                    break;
            }


            // $zamowienie->Rezerwacja = True;


            $date = date("Y-m-d H:i:s");
            $zamowienie->PoleWlasne["Czas"] = $date;

            $uwagi = "";
            switch ($order->type) {
                case 1: //SHOPER
                    $uwagi = Str::ascii("Zamówienie z belibe.pl - " . $order->number);
                    if ($order->promo_code !== null) $uwagi .= "\r\nkod rabatowy: " . $order->promo_code;
                    if ($order->comment !== null) $uwagi .= "\r\nUwagi - " . $order->comment;
                    break;

                case 2: //ALLEGRO
                    $uwagi = Str::ascii("Zamówienie z allegro.pl - " . $order->number);
                    if ($order->comment !== null) $uwagi .= "\r\nUwagi - " . $order->comment;
                    break;

                case 2: //EMPIK
                    $uwagi = Str::ascii("Zamówienie z empik.pl - " . $order->number);
                    if ($order->comment !== null) $uwagi .= "\r\nUwagi - " . $order->comment;
                    break;
            }


            $zamowienie->Uwagi = $uwagi;

            if ($zamowienie->WartoscBrutto != $order["total_gross"]) $this->fail("Niezgodne kwoty zamówienia");
            $zamowienie->Zapisz();
            $order->update([
                'subiekt_id' => $zamowienie->Identyfikator,
                'subiekt_number' => $zamowienie->NumerPelny,
                'subiekt_added_at' => $date,
                "status" => 90
            ]);
        }
    }
}
