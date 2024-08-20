<?php

namespace App\Jobs\Allegro;

use App\Helpers\Allegro\AllegroLogin;
use App\Models\AllegroToken;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AllegroRefreshToken implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;


    /**
     * Create a new job instance.
     */
    public function __construct()
    {
//
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $allegroToken = AllegroToken::query()->latest()->first();
        if (!$allegroToken) {
            $this->fail('No token found');
        }

        $result = AllegroLogin::refreshToken($allegroToken);
        if (!$result) {
            $this->fail('Refresh failed');
        }
    }
}
