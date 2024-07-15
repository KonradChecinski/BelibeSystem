<?php

namespace App\Notifications\system;

use App\Models\ClientTask;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ClientTaskReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    private ClientTask $clientTask;

    /**
     * Create a new notification instance.
     */
    public function __construct(ClientTask $clientTask)
    {
        $this->onQueue('linux');
        $this->clientTask = $clientTask;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
//        dd($this->clientTask, $notifiable);
//        dd(request());
        return (new MailMessage)
            ->subject("Przypomnienie o zadaniu")
            ->markdown("mail.system.clientTask.clientTask", [
                'clientTask' => $this->clientTask,
                'client' => $this->clientTask->client,
                'late' => Carbon::now()->gt($this->clientTask->datetime),
                'notifiable' => $notifiable,
                "actionText" => "Zobacz zadanie",
            ])
            ->action('Przejdź do klienta', route('system.clients.client.edit', ["id" => $this->clientTask->client->id]));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
