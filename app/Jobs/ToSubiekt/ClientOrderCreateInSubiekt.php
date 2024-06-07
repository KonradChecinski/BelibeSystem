<?php

namespace App\Jobs\ToSubiekt;

use App\Helpers\Helper;
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
use Illuminate\Support\Facades\DB;
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
            $zamowienie->LiczonyOdCenBrutto = false;
            $zamowienie->PoziomCenyId = 2;
            $zamowienie->Pozycje->PrzeliczWedlugPoziomuCen();

            if (!is_null($client->accountManager->subiekt_category_name)) {
                $categoryName = $client->accountManager->subiekt_category_name;
                $categorySubiekt = DB::connection("subiekt")->table("sl_Kategoria")->where("kat_Nazwa", $categoryName)->first();
                if ($categorySubiekt) {
                    $zamowienie->KategoriaId = (int)$categorySubiekt->kat_Id;
                }
            }

            $orderProducts->load(['product', 'productModel', 'productModelColor', 'product.size']);
            $orderModels = $orderProducts->pluck("productModel")->unique("id")->values();


            foreach ($orderModels as $orderModel) {
                $orderColors = $orderProducts->where("productModel.id", $orderModel->id)->pluck("productModelColor")->unique("id")->values();
                $orderColors = $orderColors->sort(fn($a, $b) => Helper::sortByProductShortcut($a, $b))->values();

                foreach ($orderColors as $orderColor) {
                    $orderColorProducts = $orderProducts->where("productModel.id", $orderModel->id)->where("productModelColor.id", $orderColor->id);
                    $orderColorProducts = $orderColorProducts->sort(fn($a, $b) => Helper::sortByProductSize($a, $b))->values();


                    foreach ($orderColorProducts as $orderProduct) {
//                $wholesale_net_price_after_payment_discount = round($orderProduct->price_net - $orderProduct->price_net * ($order->discount / 100), 0);
                        $wholesale_net_price_after_payment_discount = round($orderProduct->price_net * (100 - $order->discount) / 100);

//                dd($orderProduct->price_net, $order->discount, $wholesale_net_price_after_payment_discount);
                        $pozycja = $zamowienie->Pozycje->Dodaj((int)$orderProduct->product->subiekt_id);
                        $pozycja->CenaNettoPrzedRabatem = (float)$orderProduct->productModel->prices->wholesale_net_price / 100;
//                $pozycja->CenaNettoPrzedRabatem = (float)$orderProduct->price_net / 100;
                        $pozycja->CenaNettoPoRabacie = (float)$wholesale_net_price_after_payment_discount / 100;
                        $pozycja->IloscJm = (int)$orderProduct->quantity;
//                    $pozycja->RabatProcent = (float)0;


                        $percent = (float)$pozycja->RabatProcent;
                        if ($percent > 0 && round($percent) !== round($percent, 2)) {
                            $roundedPercent = round($percent, 0);
                            $pozycja->CenaNettoPrzedRabatem = (float)$orderProduct->productModel->prices->wholesale_net_price / 100;
                            $pozycja->RabatProcent = $roundedPercent;

                            if ((float)$pozycja->CenaNettoPoRabacie !== $wholesale_net_price_after_payment_discount / 100) {
                                $pozycja->CenaNettoPrzedRabatem = (float)$orderProduct->productModel->prices->wholesale_net_price / 100;
                                $pozycja->CenaNettoPoRabacie = (float)$wholesale_net_price_after_payment_discount / 100;
                            }

                        }


                    }
                }
            }


            if ($order->discounted_total_net < $delivery->free_from) {
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

            if ($zamowienie->WartoscNetto != $order["total_net"]) $this->fail("Niezgodne kwoty zamówienia");

            $zamowienie->Zapisz();

            $zamowienie->PlatnoscKredytId = $payment->subiekt_id;
            $zamowienie->Rozliczony = false;
            $zamowienie->Zapisz();

            dd("cos");
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
        }
    }
}
