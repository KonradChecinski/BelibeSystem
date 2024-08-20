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

class BlokadaMisieczna implements ShouldQueue
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
        // Utworzenie obiektu Carbon z aktualną datą i czasem
        $now = Carbon::now();

        // Ustalenie ostatniego dnia poprzedniego miesiąca
        $lastDayOfPreviousMonth = $now->subMonthNoOverflow()->endOfMonth();


        $result = DB::connection("subiekt")
            ->table("pd_Blokada")
            ->where("bl_Id", 1)
            ->update(["bl_BlokadaSubiekt" => $lastDayOfPreviousMonth->toDateString()]);

        if ($result === 0) {
            $this->fail("Nie udało się zaktualizować daty blokady miesięcznej");
        }
    }
}
