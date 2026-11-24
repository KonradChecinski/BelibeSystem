<?php

namespace App\Console\Commands;

use App\Jobs\System\CleanOldLogsJob;
use Illuminate\Console\Command;

class CleanOldLogsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:clean {--days=7 : Liczba ostatnich dni do zachowania w logach} {--sync : Wykonaj natychmiast zamiast wysyłać na kolejkę}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Czyści pliki logów Laravela oraz workerów, zostawiając wpisy z ostatnich N dni (domyślnie 7).';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');

        if ($this->option('sync')) {
            $this->info("Czyszczenie logów (zostawianie ostatnich {$days} dni)...");
            (new CleanOldLogsJob($days))->handle();
            $this->info('Logi zostały wyczyszczone.');
        } else {
            CleanOldLogsJob::dispatch($days);
            $this->info("Zadanie CleanOldLogsJob (ostatnie {$days} dni) zostało dodane do kolejki.");
        }

        return self::SUCCESS;
    }
}
