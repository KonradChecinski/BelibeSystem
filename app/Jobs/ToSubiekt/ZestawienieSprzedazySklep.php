<?php

namespace App\Jobs\ToSubiekt;

use App\Helpers\Subiekt\SubiektQueries;
use App\Mail\QueryShopSale;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ZestawienieSprzedazySklep implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    public int $warehouseId;
    public int $clientId;
    public string $email;
    public Carbon $from;
    public Carbon $to;

    /**
     * Create a new job instance.
     */
    public function __construct(int $warehouseId, int $clientId, string $email, Carbon $from, Carbon $to)
    {
        $this->onQueue('sfera');

        $this->warehouseId = $warehouseId;
        $this->clientId = $clientId;
        $this->email = $email;
        $this->from = $from;
        $this->to = $to;
    }

    public function uniqueId(): string
    {
        return $this->warehouseId . $this->clientId . $this->from->toDateString() . $this->to->toDateString();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = SubiektQueries::saleInWarehouse($this->warehouseId, $this->from, $this->to);
//        dd($result, $this->warehouseId, $this->clientId, $this->from->toDateString(), $this->to->toDateString());

        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = $this->warehouseId;


        $zamowienie = $subiekt->SuDokumentyManager->DodajZK();
        $zamowienie->KontrahentId = $this->clientId;
        $zamowienie->NumerOryginalny = Str::ascii("Sprzedaż ") . $this->from->format("d.m.y") . " - " . $this->to->format("d.m.y");
        $zamowienie->Podtytul = Str::ascii("Sprzedaż ") . $this->from->format("d.m.y") . " - " . $this->to->format("d.m.y");
        $zamowienie->Wystawil = "BelibeSystem";
        $zamowienie->LiczonyOdCenBrutto = false;
        $zamowienie->PoziomCenyId = 3;
        $zamowienie->Pozycje->PrzeliczWedlugPoziomuCen();

        foreach ($result as $item) {
            if ($item->tw_Zablokowany === 1) {
                $pozycja = $zamowienie->Pozycje->DodajUslugeJednorazowa();
                $pozycja->UslJednNazwa = substr((int)$item->tw_Id . ": " . $item->tw_Symbol . " - " . $item->tw_Nazwa, 0, 50);
                $pozycja->Opis = Str::ascii($item->tw_Nazwa);
                $pozycja->IloscJm = (int)$item->tw_Ilosc;
                $pozycja->CenaBruttoPrzedRabatem = 0;
            } else {
                $pozycja = $zamowienie->Pozycje->Dodaj((int)$item->tw_Id);
                $pozycja->IloscJm = (int)$item->tw_Ilosc;
            }

        }

        $zamowienie->Zapisz();
        $zamowienie->Zamknij();

        $subiekt->MagazynId = 1;

        Mail::to($this->email)->send(new QueryShopSale($result->toArray(), $this->from, $this->to));

    }
}
