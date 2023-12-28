<?php

namespace App\Console;

use App\Jobs\FromSubiekt\Cena\UpdatePriceFromSubiekt;
use App\Jobs\FromSubiekt\ModelTw\CreateModelFromSubiekt;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Jobs\FromSubiekt\Tw\CreateTwFromSubiekt;
use App\Jobs\FromSubiekt\Tw\UpdateTwFromSubiekt;
use App\Jobs\Shoper\ShoperLogin;
use App\Jobs\ToSubiekt\ModelTw\CheckIfExistModelInSubiekt;
use App\Jobs\UpdateSubiektIdWhereNull;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->job(new UpdateQuantityFromSubiekt)->everyMinute();
        $schedule->job(new UpdatePriceFromSubiekt)->everyMinute();
        $schedule->job(new UpdateSubiektIdWhereNull)->everyFiveMinutes();
        $schedule->job(new CreateModelFromSubiekt)->everyMinute();
        $schedule->job(new CheckIfExistModelInSubiekt)->everyFiveMinutes();
        $schedule->job(new CreateTwFromSubiekt)->everyMinute();
        $schedule->job(new UpdateTwFromSubiekt)->everyMinute();

        $schedule->job(new ShoperLogin)->MonthlyOn(1);
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
