<?php

namespace App\Jobs\Mail;


use App\Models\Client\Client;
use App\Notifications\b2b\SettlementsClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendB2bClientsSettlementsMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $clients = Client::whereHas('receivables', function ($query) {
            $query->whereNot('settlement', 2);
        })->get();

        foreach ($clients as $client) {
            $client->notify(new SettlementsClient());
        }

    }
}
