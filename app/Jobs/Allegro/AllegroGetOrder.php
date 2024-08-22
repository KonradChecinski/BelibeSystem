<?php

namespace App\Jobs\Allegro;

use App\Helpers\Allegro\Allegro;
use App\Helpers\Shoper\Shoper;
use App\Jobs\ToSubiekt\OrderCreateInSubiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AllegroGetOrder implements ShouldQueue
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
     * @throws \Exception
     */
    public function handle(): void
    {

        $result = Allegro::getOrders();
        if (!$result) {
            $this->fail('getting orders failed');
        }
        OrderCreateInSubiekt::dispatch();

    }
}
