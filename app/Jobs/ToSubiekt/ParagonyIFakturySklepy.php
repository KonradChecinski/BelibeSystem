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

class ParagonyIFakturySklepy implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;

    public ?Carbon $date = null;

    /**
     * Create a new job instance.
     */
    public function __construct(Carbon $date = null)
    {
        $this->onQueue('sfera');

        if (is_null($date)) {
            $this->date = $date;
        }
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $params = [
            [//Tychy
                "warehouseId" => 13,
                "categoryId" => 27,
                "paymentId" => 11
            ],
            [//DG
                "warehouseId" => 17,
                "categoryId" => 28,
                "paymentId" => 12
            ],
            [//Blonie
                "warehouseId" => 37,
                "categoryId" => 158,
                "paymentId" => 18
            ]
        ];
//        $date = Carbon::today()->subDays(2);
        if (is_null($this->date)) {
            $date = Carbon::today();
        } else {
            $date = $this->date;
        }

        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        foreach ($params as $param) {
            $subiekt->MagazynId = $param["warehouseId"];
            $this->updateParagony($subiekt, $param["warehouseId"], $param["categoryId"], $param["paymentId"], $date);
            $this->updateFV($subiekt, $param["warehouseId"], $param["categoryId"], $param["paymentId"], $date);
            $this->updateReturns($subiekt, $param["warehouseId"], $param["categoryId"], $param["paymentId"], $date);
        }

        $subiekt->MagazynId = 1;
    }

    private function updateParagony($subiekt, int $warehouseId, int $categoryId, int $paymentId, Carbon $date)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 21)
            ->where(function ($query) use ($categoryId) {
                $query->whereNot("dok_KatId", $categoryId)
                    ->orWhereNull("dok_KatId");
            })
            ->where("dok_DataWyst", ">=", $date)
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
                "dok_FiskalizacjaData"
            ]);

        foreach ($documents as $document) {
            if (is_null($document->dok_FiskalizacjaData)) continue;
            if (Carbon::parse($document->dok_FiskalizacjaData)->diffInYears($date) > 0) continue;

            try {
                $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
                $subiektDocument->KategoriaId = $categoryId;

                if (!is_null($document->dok_KartaId)) {
                    $subiektDocument->PlatnoscKartaId = $paymentId;
                }

                $subiektDocument->PoleWlasne["Czas"] = Carbon::parse($document->dok_FiskalizacjaData)->toDateTimeString();

                $subiektDocument->Zapisz();
                $subiektDocument->Zamknij();
            } catch (\Exception $e) {
                continue;
            }

        }
    }

    private function updateFV($subiekt, int $warehouseId, int $categoryId, int $paymentId, Carbon $date)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->leftJoin("pw_Dane", "dok__Dokument.dok_Id", "=", "pw_Dane.pwd_IdObiektu")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 2)
            ->where("dok_DataWyst", ">=", $date)
            ->whereNull("pwd_Data01")
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
            ]);

        foreach ($documents as $document) {
            try {
                $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
                $subiektDocument->KategoriaId = $categoryId;

                if (!is_null($document->dok_KartaId)) {
                    $subiektDocument->PlatnoscKartaId = $paymentId;
                }

                $subiektDocument->PoleWlasne["Czas"] = Carbon::now()->toDateTimeString();

                $subiektDocument->Zapisz();
                $subiektDocument->Zamknij();
            } catch (\Exception $e) {
                continue;
            }
        }
    }

    private function updateReturns($subiekt, int $warehouseId, int $categoryId, int $paymentId, Carbon $date)
    {
        $documents = DB::connection("subiekt")
            ->table("dok__Dokument")
            ->leftJoin("pw_Dane", "dok__Dokument.dok_Id", "=", "pw_Dane.pwd_IdObiektu")
            ->where("dok_MagId", $warehouseId)
            ->where("dok_Typ", 14)
            ->where("dok_DataWyst", ">=", $date)
            ->whereNull("pwd_Data01")
            ->orderBy("dok_Id")
            ->get([
                "dok_Id",
                "dok_NrPelny",
                "dok_KartaId",
            ]);

        foreach ($documents as $document) {

            try {
                $subiektDocument = $subiekt->SuDokumentyManager->Wczytaj($document->dok_NrPelny);
                $subiektDocument->KategoriaId = $categoryId;

                if (!is_null($document->dok_KartaId)) {
                    $subiektDocument->PlatnoscKartaId = $paymentId;
                }

                $subiektDocument->PoleWlasne["Czas"] = Carbon::now()->toDateTimeString();

                $subiektDocument->Zapisz();
                $subiektDocument->Zamknij();
            } catch (\Exception $e) {
                continue;
            }

        }
    }

}
