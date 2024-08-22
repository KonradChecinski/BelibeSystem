<?php

namespace App\Jobs\ToSubiekt;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ZmianaDatyFormatowanieWarunkoweListaNierozliczonychNaleznosci implements ShouldQueue
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
        $date = Carbon::today(); // Użycie Carbon do pobrania dzisiejszej daty

        $dayOfWeek = $date->dayOfWeek; // Pobranie dnia tygodnia (0 = niedziela, 1 = poniedziałek, ..., 6 = sobota)

        switch ($dayOfWeek) {
            case Carbon::MONDAY: // Poniedziałek
                $dateFrom = $date->copy()->subDays(5);
                $dateTo = $date->copy()->subDays(3);
                break;
            case Carbon::TUESDAY: // Wtorek
                $dateFrom = $date->copy()->subDays(5);
                $dateTo = $date->copy()->subDays(1);
                break;
            default: // W przypadku innego dnia tygodnia
                $dateFrom = $date->copy()->subDays(3);
                $dateTo = $date->copy()->subDays(1);
                break;
        }


        $result = DB::connection("subiekt")
            ->table("gr_FormatowanieWarunek")
            ->where("grfww_Id", 10)
            ->update(["grfww_Wartosc" => $dateFrom->toDateString()]);

        if ($result === 0) {
            $this->fail("Nie udało się zaktualizować fortmatowania warunkowego");
        }

        $result = DB::connection("subiekt")
            ->table("gr_FormatowanieWarunek")
            ->where("grfww_Id", 11)
            ->update(["grfww_Wartosc" => $dateTo->toDateString()]);

        if ($result === 0) {
            $this->fail("Nie udało się zaktualizować fortmatowania warunkowego");
        }

    }
}
