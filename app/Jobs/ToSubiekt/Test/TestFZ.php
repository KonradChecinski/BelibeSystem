<?php

namespace App\Jobs\ToSubiekt\Test;

use App\Http\Controllers\System\TestController;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\SimpleExcel\SimpleExcelReader;

class TestFZ implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;
    public $timeout = 600;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('test');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $path = storage_path("app/test/2.csv");
        $rows = SimpleExcelReader::create($path)
            ->useHeaders(["lp", "symbol", "stan", "cena_magazynowa", "wartosc_netto", "wartosc_brutto"])
            ->useDelimiter(";")
            ->getRows();

        $fz = $subiekt->SuDokumentyManager->DodajFZ();
        $fz->KontrahentId = 128;
        $fz->NumerOryginalny = "???";
        $fz->LiczonyOdCenBrutto = false;
        $fz->PoziomCenyId = 2;
        $fz->Pozycje->PrzeliczWedlugPoziomuCen();


        $rows->each(function ($row) use ($fz) {
//            dd($row);
            $towarId = Towar::query()->where("tw_Symbol", $row["symbol"])->first()->tw_Id;
            $cena = (float)str_replace(',', '.', str_replace('.', '', $row["cena_magazynowa"]));


            $pozycja = $fz->Pozycje->Dodaj($towarId);
            $pozycja->CenaNettoPrzedRabatem = $cena;
            $pozycja->IloscJm = (int)$row["stan"];
        });

        $fz->Zapisz();
    }
}
