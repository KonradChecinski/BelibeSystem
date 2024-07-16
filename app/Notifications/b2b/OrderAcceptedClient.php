<?php

namespace App\Notifications\b2b;

use App\Models\ClientOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class OrderAcceptedClient extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    private ClientOrder $clientOrder;

    /**
     * Create a new notification instance.
     */
    public function __construct(ClientOrder $clientOrder)
    {
        $this->onQueue('linux');
        $this->clientOrder = $clientOrder;
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
        return (new MailMessage)
            ->subject("Twoje zamówienie zostało potwierdzone")
            ->markdown("mail.b2b.orderAccepted.client.orderAccepted", [
                'clientOrder' => $this->clientOrder,
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
