<?php

namespace App\Jobs\Mail;


use App\Models\ClientTask;
use App\Notifications\ClientTaskReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendClientTaskMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    private ClientTask $clientTask;

    /**
     * Create a new job instance.
     */
    public function __construct(ClientTask $clientTask)
    {
        $this->onQueue('linux');
        $this->clientTask = $clientTask;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->clientTask->user->notify(new ClientTaskReminder($this->clientTask));
        if ($this->clientTask->user->id !== $this->clientTask->client->accountManager->id) {
            $this->clientTask->client->accountManager->notify(new ClientTaskReminder($this->clientTask));
        }
    }
}
