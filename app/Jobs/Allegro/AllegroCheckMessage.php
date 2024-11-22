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

class AllegroCheckMessage implements ShouldQueue, ShouldBeUnique
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
        $threads = Allegro::getMessThreads()->json()["threads"];
        $threads = collect(json_decode(json_encode($threads), false));
        $unreadThreads = $threads->filter(function ($thread) {
            return $thread->read === false;
        });

        foreach ($unreadThreads as $thread) {
            AllegroAnswerMessageThread::dispatch($thread);
        }
    }
}
