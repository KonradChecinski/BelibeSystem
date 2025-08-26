<?php

namespace App\Listeners;

use App\Models\EmailLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Queue\InteractsWithQueue;

class LogSentEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        $message = $event->message ?? null; // zwykle obiekt maila (Symfony Email)
        $data = is_array($event->data ?? null) ? $event->data : [];

        $mailable = $data['mailable'] ?? ($event->mailable ?? null);
        $notification = $data['notification'] ?? null;
        $notifiable = $data['notifiable'] ?? null;

        // origin
        $originType = null;
        $originClass = null;
        if ($notification) {
            $originType = 'notification';
            $originClass = is_object($notification) ? get_class($notification) : (string)$notification;
        } elseif ($mailable) {
            $originType = 'mailable';
            $originClass = is_object($mailable) ? get_class($mailable) : (string)$mailable;
        } else {
            $originType = 'raw';
            $originClass = null;
        }

        // jeśli stosujemy konwencję public $model w Mailable -> przypisz mailable model
        $mailableModel = null;
        if (is_object($mailable) && property_exists($mailable, 'model') && $mailable->model instanceof Model) {
            $mailableModel = $mailable->model;
        }

        // notifiable (np. User) -> zapisujemy kto był notifiable
        $notifiableModel = $notifiable instanceof Model ? $notifiable : null;

        // pola maila
        $from = $to = $cc = $bcc = [];
        $subject = null;
        $body = null;
        $headers = [];
        $attachmentNames = [];
        $messageId = null;

        if (is_object($message)) {
            // preferuj "Symfony Email" jeśli dostępna
            $isSymfonyEmail = class_exists(\Symfony\Component\Mime\Email::class) && ($message instanceof \Symfony\Component\Mime\Email);

            if ($isSymfonyEmail) {
                // adresy (array of Address)
                $from = $this->mapAddresses($message->getFrom());
                $to = $this->mapAddresses($message->getTo());
                $cc = $this->mapAddresses($message->getCc());
                $bcc = $this->mapAddresses($message->getBcc());

                $subject = $message->getSubject();
                $body = $message->getHtmlBody() ?? $message->getTextBody() ?? '';

                // headers
                try {
                    foreach ($message->getHeaders()->all() as $h) {
                        $headers[$h->getName()] = $h->getBodyAsString();
                    }
                    $hdr = $message->getHeaders()->get('Message-ID');
                    if ($hdr) $messageId = $hdr->getBodyAsString();
                } catch (\Throwable $e) {
                    // ignore parsing header errors
                }

                // attachments (tylko nazwy)
                $atts = $message->getAttachments() ?? [];
                foreach ($atts as $att) {
                    if (is_object($att)) {
                        if (method_exists($att, 'getFilename') && $att->getFilename()) {
                            $attachmentNames[] = $att->getFilename();
                        } elseif (method_exists($att, 'getName') && $att->getName()) {
                            $attachmentNames[] = $att->getName();
                        }
                    }
                }
            } else {
                // fallback: defensywne wyciąganie przez metody jeśli istnieją
                $from = $this->mapAddresses($this->callIfExists($message, 'getFrom') ?? $this->callIfExists($message, 'getFromAddresses'));
                $to = $this->mapAddresses($this->callIfExists($message, 'getTo') ?? $this->callIfExists($message, 'getToAddresses'));
                $cc = $this->mapAddresses($this->callIfExists($message, 'getCc'));
                $bcc = $this->mapAddresses($this->callIfExists($message, 'getBcc'));

                $subject = $this->callIfExists($message, 'getSubject');
                $body = $this->callIfExists($message, 'getHtmlBody') ?? $this->callIfExists($message, 'getTextBody')
                    ?? $this->callIfExists($message, 'getBody') ?? (string)$message;

                $hdrs = $this->callIfExists($message, 'getHeaders');
                if (is_object($hdrs) && method_exists($hdrs, 'all')) {
                    foreach ($hdrs->all() as $h) {
                        if (is_object($h) && method_exists($h, 'getName')) {
                            try {
                                $headers[$h->getName()] = $h->getBodyAsString();
                            } catch (\Throwable $e) {
                            }
                        }
                    }
                } elseif (is_array($hdrs)) {
                    $headers = $hdrs;
                }

                $messageId = $headers['Message-ID'] ?? $headers['message-id'] ?? null;

                $atts = $this->callIfExists($message, 'getAttachments') ?? $this->callIfExists($message, 'getChildren');
                if (is_iterable($atts)) {
                    foreach ($atts as $att) {
                        if (is_object($att) && method_exists($att, 'getFilename')) {
                            $n = $att->getFilename();
                            if ($n) $attachmentNames[] = $n;
                        } elseif (is_object($att) && method_exists($att, 'getName')) {
                            $n = $att->getName();
                            if ($n) $attachmentNames[] = $n;
                        }
                    }
                }
            }
        } elseif (is_string($message)) {
            $body = $message;
        }

        // to_emails pomocniczo
        $toEmails = collect($to)->pluck('address')->implode(',');

        // zapis do bazy
        EmailLog::create([
            'mailable_type' => $mailableModel ? $mailableModel->getMorphClass() : null,
            'mailable_id' => $mailableModel ? $mailableModel->getKey() : null,

            'notifiable_type' => $notifiableModel ? $notifiableModel->getMorphClass() : null,
            'notifiable_id' => $notifiableModel ? $notifiableModel->getKey() : null,

            'origin_type' => $originType,
            'origin_class' => $originClass,

            'from' => $from,
            'to' => $to,
            'cc' => $cc,
            'bcc' => $bcc,
            'to_emails' => $toEmails,

            'subject' => $subject,
            'body' => $body,

            'headers' => $headers,
            'attachments' => $attachmentNames,

            'size' => $body ? strlen($body) : null,
            'message_id' => $messageId,
            'sent_at' => now(),
        ]);
    }

    private function callIfExists($obj, string $method)
    {
        if (!is_object($obj)) return null;
        if (!method_exists($obj, $method)) return null;
        try {
            return $obj->{$method}();
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function mapAddresses($addresses): array
    {
        if (empty($addresses)) return [];

        $out = [];
        if (is_array($addresses)) {
            foreach ($addresses as $k => $v) {
                if (is_object($v) && method_exists($v, 'getAddress')) {
                    $out[] = ['name' => method_exists($v, 'getName') ? $v->getName() : null, 'address' => $v->getAddress()];
                    continue;
                }
                if (is_string($k) && is_string($v)) {
                    $out[] = ['name' => $v ?: null, 'address' => $k];
                    continue;
                }
                if (is_string($v)) {
                    $out[] = ['name' => null, 'address' => $v];
                    continue;
                }
                if (is_array($v) && isset($v['address'])) {
                    $out[] = ['name' => $v['name'] ?? null, 'address' => $v['address']];
                    continue;
                }
            }
        } elseif (is_string($addresses)) {
            $out[] = ['name' => null, 'address' => $addresses];
        }

        return $out;
    }
}
