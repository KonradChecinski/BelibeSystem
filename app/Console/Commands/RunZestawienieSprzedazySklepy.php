<?php

namespace App\Console\Commands;

use App\Jobs\ToSubiekt\ZestawienieSprzedazySklepy;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class RunZestawienieSprzedazySklepy extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-zestawienie-sprzedazy-sklepy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Uruchom zadanie ZestawienieSprzedazySklepy';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ZestawienieSprzedazySklepy::dispatch();
    }
}
