<?php

namespace App\Jobs\Allegro;

use App\Helpers\Allegro\Allegro;
use App\Helpers\Shoper\Shoper;
use App\Jobs\ToSubiekt\OrderCreateInSubiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AllegroAnswerMessageThread implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    public object $thread;

    /**
     * Create a new job instance.
     */
    public function __construct(object $thread)
    {
        $this->onQueue('linux');
        $this->thread = $thread;
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        $message = "Dzień dobry.
Postaramy się odpisać jak najszybciej.
Pracujemy od pon. do pt. od 8:00 do 16:00.";

        $result = Allegro::changeMessThreadStatus($this->thread->id);
        if (!$result) {
            $this->fail('changing thread status failed');
        }

        $result = Allegro::sendMessInMessThread($this->thread->id, $message);
        if (!$result) {
            $this->fail('sending message failed');
        }
    }
}
