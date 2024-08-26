<?php

namespace App\Jobs\ToSubiekt;

use App\Helpers\Subiekt\SubiektQueries;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ZestawienieSprzedazySklepy implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $params = [
            (object)[//Tychy
                "warehouseId" => 13,
                "client" => 1309,
                "email" => "konrad.checinski@belibe.pl",
            ],
            (object)[//DG
                "warehouseId" => 17,
                "client" => 1310,
//                "email" => "sklep.dg@belibe.pl",
                "email" => "konrad.checinski@belibe.pl",
            ],
            (object)[//Blonie
                "warehouseId" => 37,
                "client" => 1543,
//                "email" => "sklep.blonie@belibe.pl",
                "email" => "konrad.checinski@belibe.pl",
            ]
        ];

        $givenDate = Carbon::now();

        // Użycie Carbon do obliczenia daty "od" (poprzedni poniedziałek)
        $from = Carbon::now()->previous(Carbon::MONDAY)->startOfDay();

        // Sprawdzenie, czy obecny dzień to poniedziałek
        if ($givenDate->isMonday()) {
            // Użycie Carbon do obliczenia daty "do" (poprzednia niedziela)
            $to = Carbon::now()->previous(Carbon::SUNDAY)->endOfDay();
        } else {
            // Ustawienie daty "do" na bieżący czas
            $to = $givenDate;
        }
//
//        $from = Carbon::parse("2024-06-24");
//        $to = Carbon::parse("2024-06-30");

        foreach ($params as $param) {
            ZestawienieSprzedazySklep::dispatch($param->warehouseId, $param->client, $param->email, $from, $to);
        }


//        if ($result === 0) {
//            $this->fail("Nie udało się zaktualizować daty blokady miesięcznej");
//        }
    }
}
