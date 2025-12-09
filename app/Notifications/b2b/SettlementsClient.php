<?php

namespace App\Notifications\b2b;

use App\Models\Client\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SettlementsClient extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    private Client $client;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
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
    public function toMail(Client $notifiable): MailMessage
    {

        $this->client = $notifiable;
        return (new MailMessage)
            ->subject("Zestawienie Twoich rozrachunków")
            ->markdown("mail.b2b.settlements.client.settlements", [
                'client' => $this->client,
                'settlements' => $this->client->receivables()->whereNot("settlement", 2)->get(),
                'notifiable' => $notifiable,
            ]);
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
