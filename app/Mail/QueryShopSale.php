<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class QueryShopSale extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 2;
    public $backoff = 5;
    public $timeout = 60;

    public Collection|array $items;
    public Carbon $fromDate;
    public Carbon $toDate;

    /**
     * Create a new message instance.
     */
    public function __construct(array $items, Carbon $from, Carbon $to)
    {
        $this->onQueue('linux');
        $this->items = collect(json_decode(json_encode($items)));
        $this->fromDate = $from;
        $this->toDate = $to;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Zamówienie zostało wygenerowane za sprzedaż " . $this->fromDate->format("d.m.y") . " - " . $this->toDate->format("d.m.y"),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: "mail.system.queryShopSale.queryShopSale",
            with: [
                'items' => $this->items,
                'from' => $this->fromDate,
                'to' => $this->toDate,
                'level' => "success",
            ],

        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
