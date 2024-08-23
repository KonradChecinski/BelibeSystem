<?php

namespace App\Jobs\ToSubiekt;

use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Container\Container;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ParagonyIFakturyBiuro implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
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
        $warehouseId = 1;
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();


        $this->updateParagony($subiekt, $warehouseId);
        $this->updateFV($subiekt, $warehouseId);
        $this->updateReturns($subiekt, $warehouseId);

    }

    private function updateParagony($subiekt, int $warehouseId)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->leftJoin("pw_Dane", "dok__Dokument.dok_Id", "=", "pw_Dane.pwd_IdObiektu")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 21)
            ->whereNull("pwd_Data01")
            ->where("dok_DataWyst", ">=", Carbon::today())
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
                "dok_FiskalizacjaData"
            ]);

        foreach ($documents as $document) {
            if (is_null($document->dok_FiskalizacjaData)) continue;
            if (Carbon::parse($document->dok_FiskalizacjaData)->diffInYears(Carbon::today()) > 0) continue;

            $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
            $subiektDocument->PoleWlasne["Czas"] = Carbon::parse($document->dok_FiskalizacjaData)->toDateTimeString();

            $subiektDocument->Zapisz();
            $subiektDocument->Zamknij();
        }
    }

    private function updateFV($subiekt, int $warehouseId)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->leftJoin("pw_Dane", "dok__Dokument.dok_Id", "=", "pw_Dane.pwd_IdObiektu")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 2)
            ->where("dok_DataWyst", ">=", Carbon::today())
            ->whereNull("pwd_Data01")
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
            ]);

        foreach ($documents as $document) {

            $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
            $subiektDocument->PoleWlasne["Czas"] = Carbon::now()->toDateTimeString();

            $subiektDocument->Zapisz();
            $subiektDocument->Zamknij();
        }
    }

    private function updateReturns($subiekt, int $warehouseId)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->leftJoin("pw_Dane", "dok__Dokument.dok_Id", "=", "pw_Dane.pwd_IdObiektu")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 14)
            ->where("dok_DataWyst", ">=", Carbon::today())
            ->whereNull("pwd_Data01")
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
            ]);

        foreach ($documents as $document) {

            $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
            $subiektDocument->PoleWlasne["Czas"] = Carbon::now()->toDateTimeString();

            $subiektDocument->Zapisz();
            $subiektDocument->Zamknij();
        }
    }

}
