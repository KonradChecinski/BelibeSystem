<?php

namespace App\Notifications;

use App\Models\ClientTask;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClientTaskReminder extends Notification //implements ShouldQueue
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
//        dd("test", $this, $notifiable);
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
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
