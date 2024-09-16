<?php

namespace App\Mail;

use App\Models\WarehouseDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class WarehouseDocumentCreated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 2;
    public $backoff = 5;
    public $timeout = 60;

    public WarehouseDocument $warehouseDocument;

    /**
     * Create a new message instance.
     */
    public function __construct(WarehouseDocument $warehouseDocument)
    {
        $this->onQueue('linux');
        $this->warehouseDocument = $warehouseDocument;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pojawiło się nowe zamówienie do przetworzenia - " . $this->warehouseDocument->number,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: "mail.system.warehouseDocument.created",
            with: [
                'level' => "success",
                'actionText' => "Przejdź do dokumentów magazynowych",
                'actionUrl' => route('system.warehouse.documents'),
                'displayableActionUrl' => route('system.warehouse.documents'),
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
