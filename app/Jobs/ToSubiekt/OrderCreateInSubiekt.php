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

        $orders = Order::where('subiekt_added_at', null)->where("status", 2)->get();

        foreach ($orders as $order) {
            $prefix = "";
            if ($order->type == 1) $prefix = "SHP ";
            $orderProducts = $order->orderProducts;

            $zamowienie = $subiekt->SuDokumentyManager->DodajZK();
//            $zamowienie->NumerOryginalny = mb_substr("SHP " . $order['order_id'] . " - " . iconv("UTF-8", "Windows-1250//IGNORE", $order['firstname']) . " " . iconv("UTF-8", "Windows-1250//IGNORE", $order['lastname']), 0, 30);
            $zamowienie->NumerOryginalny = mb_substr($prefix . $order['order_id'] . " - " . Str::ascii($order['firstname']) . " " . Str::ascii($order['lastname']), 0, 30);
            $zamowienie->LiczonyOdCenBrutto = true;
            $zamowienie->PoziomCenyId = 3;
            $zamowienie->Pozycje->PrzeliczWedlugPoziomuCen();
            $zamowienie->KategoriaId = 115;
            $zamowienie->PlatnoscKartaId = 15;

            foreach ($orderProducts as $orderProduct) {
                if ($orderProduct->product_id != null) {
                    $productSubiektId = Product::find($orderProduct->product_id)->subiekt_id;
                } else {
                    $productSubiekt = Towar::where("tw_Symbol", $orderProduct->product_code)->first();
                    $productSubiektId = is_null($productSubiekt) ? null : $productSubiekt->tw_Id;
                }


                if (is_null($productSubiektId)) {
                    $pozycja = $zamowienie->Pozycje->DodajUslugeJednorazowa();
                    $pozycja->UslJednNazwa = substr($orderProduct["code"], 0, 50);
                    $pozycja->Opis = mb_convert_encoding("Usługa jednorazowa", 'iso-8859-2', 'utf-8');
                    $pozycja->IloscJm = (float)$orderProduct['quantity'];
                    $pozycja->CenaBruttoPrzedRabatem = (float)$orderProduct['price'];
//                    $pozycja->RabatProcent = (float)0;
                    $pozycja->CenaBruttoPoRabacie = (float)$orderProduct['discounted_price'];
                } else {
                    $pozycja = $zamowienie->Pozycje->Dodaj((int)$productSubiektId);
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
            $zamowienie->KontrahentId = 1439;
            $zamowienie->Wystawil = "Shoper";


            // $zamowienie->Rezerwacja = True;


            $date = date("Y-m-d H:i:s");
            $zamowienie->PoleWlasne["Czas"] = $date;
            $uwagi = Str::ascii("Zamówienie z belibe.pl - " . $order["order_id"]);
            if ($order["promo_code"] !== "") $uwagi .= " - kod rabatowy: " . $order["promo_code"];
            $zamowienie->Uwagi = $uwagi;

            if ($zamowienie->WartoscBrutto != $order["total_gross"]) $this->fail("Niezgodne kwoty zamówienia");
            $zamowienie->Zapisz();
            $order->update([
                'subiekt_id' => $zamowienie->Identyfikator,
                'subiekt_number' => $zamowienie->NumerPelny,
                'subiekt_added_at' => $date,
                "status" => 4
            ]);
        }
    }
}
