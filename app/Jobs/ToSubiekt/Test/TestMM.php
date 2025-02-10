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

class TestMM implements ShouldQueue
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

        $path = storage_path("app/test/mm2.csv");
        $rows = SimpleExcelReader::create($path)
            ->useHeaders(["Symbol", "MM"])
            ->useDelimiter(";")
            ->getRows();
        $filteredRows = $rows->filter(fn($row) => preg_match('/\d/', $row['MM']))->values()->toArray();

        for ($i = 0; $i < ceil(count($filteredRows) / 50); $i++) {
            $mm = $subiekt->SuDokumentyManager->DodajMM();
            $mm->MagazynOdbiorczyId = 47;
            $mm->StatusDokumentu = 3;

            for ($j = 0; $j < 50; $j++) {
                $row = $filteredRows[$i * 50 + $j] ?? null;
                if ($row) {
                    $towarId = Towar::query()->where("tw_Symbol", $row["Symbol"])->first()->tw_Id;
                    $pozycja = $mm->Pozycje->Dodaj($towarId);
                    $pozycja->IloscJm = (int)$row["MM"];
                }
            }

            $mm->Zapisz();
        }
    }
}
