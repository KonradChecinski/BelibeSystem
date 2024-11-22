<?php

namespace App\Jobs\Empik;

use App\Helpers\Empik\Empik;
use App\Jobs\ToSubiekt\OrderCreateInSubiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EmpikGetNewOrder implements ShouldQueue, ShouldBeUnique
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
        $result = Empik::getOrders();
        if (!$result) {
            $this->fail('getting new orders failed');
        }
    }
}
