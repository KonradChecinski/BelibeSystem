<?php

namespace App\Console;

use App\Jobs\Allegro\AllegroCheckMessage;
use App\Jobs\Allegro\AllegroGetOrder;
use App\Jobs\Allegro\AllegroRefreshToken;
use App\Jobs\Empik\EmpikGetNewOrder;
use App\Jobs\Empik\EmpikGetReadyOrder;
use App\Jobs\Empik\EmpikUpdateOffers;
use App\Jobs\Empik\EmpikUpdateProducts;
use App\Jobs\FromSubiekt\Finanse\CreateSettlementsFromSubiekt;
use App\Jobs\FromSubiekt\Finanse\DeleteSettlementsFromSubiekt;
use App\Jobs\FromSubiekt\Finanse\UpdateSettlementsFromSubiekt;
use App\Jobs\FromSubiekt\ModelTw\CreateModelFromSubiekt;
use App\Jobs\FromSubiekt\Stan\UpdateQuantityFromSubiekt;
use App\Jobs\FromSubiekt\Tw\CreateTwFromSubiekt;
use App\Jobs\FromSubiekt\Tw\UpdateTwFromSubiekt;
use App\Jobs\FromSubiekt\UpdateClientOrderStatus;
use App\Jobs\FromSubiekt\UpdateOrderStatus;
use App\Jobs\FromSubiekt\UpdateSubiektIdWhereNull;
use App\Jobs\Mail\SendClientTaskMail;
use App\Jobs\partners\MakePartnerExportFile;
use App\Jobs\Shoper\ShoperGetOrder;
use App\Jobs\Shoper\ShoperLogin;
use App\Jobs\ToSubiekt\BlokadaMiesieczna;
use App\Jobs\ToSubiekt\ClientOrderCreateInSubiekt;
use App\Jobs\ToSubiekt\ModelTw\CheckIfExistModelInSubiekt;
use App\Jobs\ToSubiekt\ParagonyIFakturyBiuro;
use App\Jobs\ToSubiekt\ParagonyIFakturySklepy;
use App\Jobs\ToSubiekt\ZestawienieSprzedazySklepy;
use App\Jobs\ToSubiekt\ZmianaDatyFormatowanieWarunkoweListaNierozliczonychNaleznosci;
use App\Models\ClientTask;
use App\Models\PartnerExport;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Carbon;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
//        $schedule->command('inspire')->hourly();
        $schedule->job(new UpdateQuantityFromSubiekt)->everyMinute();
//        $schedule->job(new UpdatePriceFromSubiekt)->everyMinute();
        $schedule->job(new UpdateSubiektIdWhereNull)->everyFiveMinutes();
        $schedule->job(new CreateModelFromSubiekt)->everyMinute();
        $schedule->job(new CheckIfExistModelInSubiekt)->everyFiveMinutes();
        $schedule->job(new CreateTwFromSubiekt)->everyMinute();
        $schedule->job(new UpdateTwFromSubiekt)->everyMinute();

        //ClientOrder
        $schedule->job(new ClientOrderCreateInSubiekt)->everyMinute();
        $schedule->job(new UpdateClientOrderStatus)->everyMinute();

        //Settlements
        $schedule->job(new DeleteSettlementsFromSubiekt)->everyMinute();
        $schedule->job(new CreateSettlementsFromSubiekt)->everyMinute();
        $schedule->job(new UpdateSettlementsFromSubiekt)->everyMinute();

        //Shoper
        $schedule->job(new ShoperLogin)->MonthlyOn(1);
        $schedule->job(new ShoperGetOrder)->everyFiveMinutes();
        $schedule->job(new UpdateOrderStatus)->everyMinute();

        //Allegro
        $schedule->job(new AllegroRefreshToken)->everySixHours();
        $schedule->job(new AllegroGetOrder)->everyFiveMinutes();
        $schedule->job(new AllegroCheckMessage)->everyFiveMinutes();

        //Empik
        $schedule->job(new EmpikGetNewOrder)->everyFiveMinutes();
        $schedule->job(new EmpikGetReadyOrder)->cron('2-59/5 * * * *');

        $schedule->job(new EmpikUpdateProducts())->everyFifteenMinutes();
        $schedule->job(new EmpikUpdateOffers())->everyFiveMinutes();


        //Subiekt
        $schedule->job(new BlokadaMiesieczna)->monthlyOn(5, '07:00');
        $schedule->job(new BlokadaMiesieczna)->monthlyOn(6, '07:00');
        $schedule->job(new ZmianaDatyFormatowanieWarunkoweListaNierozliczonychNaleznosci)->dailyAt('00:01');
        $schedule->job(new ZestawienieSprzedazySklepy)->mondays()->at('09:00');

        //Subiekt paragony
        $schedule->job(new ParagonyIFakturySklepy)->everyMinute()->between('9:00', '21:00');
        $schedule->job(new ParagonyIFakturySklepy)->everyFiveMinutes()->between('21:00', '9:00');
        $schedule->job(new ParagonyIFakturyBiuro)->everyMinute()->between('9:00', '21:00');
        $schedule->job(new ParagonyIFakturyBiuro)->everyFiveMinutes()->between('21:00', '9:00');

        //Telescope
        $schedule->command('telescope:prune')->daily();
        //Websocket
        $schedule->command('websockets:clean')->daily();

        $partnerExports = PartnerExport::all();
        foreach ($partnerExports as $partnerExport) {
            $schedule->job(new MakePartnerExportFile($partnerExport->partner, $partnerExport))->cron($partnerExport->cron);
        }

        $clientTasks = ClientTask::where('done', null)->get();
        foreach ($clientTasks as $clientTask) {
            $now = Carbon::now();
            $dayBefore = Carbon::parse($clientTask->datetime)->subDay();
            $hourBefore = Carbon::parse($clientTask->datetime)->subHour();
            $exactTime = Carbon::parse($clientTask->datetime);

            $schedule->job(new SendClientTaskMail($clientTask))->when(function () use ($now, $dayBefore) {
                return $now->isSameYear($dayBefore) && $now->isSameMonth($dayBefore) && $now->isSameDay($dayBefore) && $now->isSameHour($dayBefore) && $now->isSameMinute($dayBefore);
            });
            $schedule->job(new SendClientTaskMail($clientTask))->when(function () use ($now, $hourBefore) {
                return $now->isSameYear($hourBefore) && $now->isSameMonth($hourBefore) && $now->isSameDay($hourBefore) && $now->isSameHour($hourBefore) && $now->isSameMinute($hourBefore);
            });
            $schedule->job(new SendClientTaskMail($clientTask))->when(function () use ($now, $exactTime) {
                return $now->isSameYear($exactTime) && $now->isSameMonth($exactTime) && $now->isSameDay($exactTime) && $now->isSameHour($exactTime) && $now->isSameMinute($exactTime);
            });
            $schedule->job(new SendClientTaskMail($clientTask))->when(function () use ($now, $exactTime) {
                return $now->diffInDays($exactTime) > 0 && $now->isSameHour($exactTime) && $now->isSameMinute($exactTime);
            });
        }
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
