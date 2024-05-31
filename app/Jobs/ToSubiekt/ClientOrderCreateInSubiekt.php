<?php

namespace App\Jobs\ToSubiekt;

use App\Models\B2bDelivery;
use App\Models\ClientOrder;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class ClientOrderCreateInSubiekt implements ShouldQueue
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

        $orders = ClientOrder::where("status", 2)->get(); // do zmiany na 3


        foreach ($orders as $order) {
            $orderProducts = $order->orderProducts;
            $client = $order->client;
            $delivery = $order->delivery;
            $payment = $order->payment;
            $location = $order->location;

//            dd($order, $client, $orderProducts, $payment, $location, $delivery);

            $zamowienie = $subiekt->SuDokumentyManager->DodajZK();
            $zamowienie->NumerOryginalny = mb_substr(Str::ascii($order->number), 0, 30);
            $zamowienie->LiczonyOdCenBrutto = true;
            $zamowienie->PoziomCenyId = 2;
            $zamowienie->Pozycje->PrzeliczWedlugPoziomuCen();
//            $zamowienie->KategoriaId = 115;


            foreach ($orderProducts as $orderProduct) {

                $pozycja = $zamowienie->Pozycje->Dodaj((int)$orderProduct->product->subiekt_id);
                $pozycja->IloscJm = (int)$orderProduct->quantity;
//                $pozycja->CenaBruttoPrzedRabatem = (float)$orderProduct['price'];
//                    $pozycja->RabatProcent = (float)0;
                $pozycja->CenaBruttoPrzedRabatem = (float)$orderProduct->price_gross / 100;

            }

            if ($order->discounted_total_net < $delivery->free_shipping_from) {
//                $pozycja = $zamowienie->Pozycje->DodajUslugeJednorazowa();
//                $pozycja->UslJednNazwa = substr($delivery->name, 0, 50);
////                $pozycja->Opis = mb_convert_encoding("Usługa jednorazowa", 'iso-8859-2', 'utf-8');
//                $pozycja->Opis = substr($delivery->description, 0, 50);
//                $pozycja->IloscJm = (float)1;
//                $pozycja->CenaBruttoPrzedRabatem = (float)$delivery->price_gross / 100;
//                $pozycja->RabatProcent = (float)0;
                $pozycja = $zamowienie->Pozycje->Dodaj((int)$delivery->subiekt_id);
                $pozycja->Opis = substr($delivery->description, 0, 50);
                $pozycja->IloscJm = (float)1;
                $pozycja->CenaNettoPrzedRabatem = (float)$delivery->price_net / 100;
            }


            $zamowienie->PlatnoscKredytKwota = $zamowienie->KwotaDoZaplaty;
            $zamowienie->PlatnoscKredytId = $payment->subiekt_id;
            $zamowienie->Rozliczony = false;

            $zamowienie->KontrahentId = $client->subiekt_id;
            $zamowienie->Wystawil = "B2B";


            // $zamowienie->Rezerwacja = True;


            $date = date("Y-m-d H:i:s");
            $zamowienie->PoleWlasne["Czas"] = $date;
            $uwagi = "Dostawa do: ";
            $uwagi .= Str::ascii($location->note) . "\r\n";
            $uwagi .= Str::ascii($location->street) . " " . Str::ascii($location->building_number);
            if ($location->apartment_number) $uwagi .= "/" . Str::ascii($location->apartment_number);
            $uwagi .= "\r\n";
            $uwagi .= Str::ascii($location->postal_code) . " " . Str::ascii($location->city);
            if ($location->country) $uwagi .= " " . Str::ascii($location->country->name);
            $uwagi .= "\r\n \r\n";


            $uwagi .= "Uwagi: " . Str::ascii($order->comment);
            $zamowienie->Uwagi = mb_substr($uwagi, 0, 255);

            if ($zamowienie->WartoscBrutto != $order["total_gross"]) $this->fail("Niezgodne kwoty zamówienia");

            $zamowienie->Zapisz();

            $zamowienie->PlatnoscKredytId = $payment->subiekt_id;
            $zamowienie->Rozliczony = false;
            $zamowienie->Zapisz();

            $order->update([
                'subiekt_id' => $zamowienie->Identyfikator,
                'subiekt_number' => $zamowienie->NumerPelny,
                'subiekt_added_at' => $date,
                "status" => 4
            ]);

            //dok_Status =
            // 8 - zrealizowane
            // 6 - niezrealizowane

            // dok_StatusEx
            // 1 - zrealizowane częściowo
            // 4 - zrealizowane

            die("dodano");
        }
    }
}
