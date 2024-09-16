<?php

namespace App\Console\Commands;

use App\Jobs\ToSubiekt\ParagonyIFakturySklepy;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class RunParagonyIFakturySklepyWithDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-paragony-i-faktury-sklepy {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dateString = $this->argument('date');
        $date = Carbon::parse($dateString);
        ParagonyIFakturySklepy::dispatch($date);
    }
}
