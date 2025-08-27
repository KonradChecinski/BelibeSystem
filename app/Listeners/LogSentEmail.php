<?php

namespace App\Listeners;

use App\Models\EmailLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Queue\InteractsWithQueue;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

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
        $message = $event->message;

        // sprawdzamy typ wiadomości
        if (!$message instanceof Email) {
            return;
        }

        // odbiorcy
        $from = collect($message->getFrom())->map(function (Address $a) {
            return ['name' => $a->getName(), 'address' => $a->getAddress() ];
        })->toArray();
        $to = collect($message->getTo())->map(function (Address $a) {
            return ['name' => $a->getName(), 'address' => $a->getAddress() ];
        })->toArray();
        $cc = collect($message->getCc())->map(function (Address $a) {
            return ['name' => $a->getName(), 'address' => $a->getAddress() ];
        })->toArray();
        $bcc = collect($message->getBcc())->map(function (Address $a) {
            return ['name' => $a->getName(), 'address' => $a->getAddress() ];
        })->toArray();



        // temat, body, załączniki
        $subject = $message->getSubject();
        $body = $message->getHtmlBody() ?? $message->getTextBody();
        $attachments = collect($message->getAttachments())->map(function ($a) {
            return $a->getFilename();
        })->toArray();

        // domyślne wartości
        $notifiableId = null;
        $notifiableType = null;
        $type = null;
        $class = null;

        if (isset($event->data['notifiable'])) { //Notification
//            $notification = $event->data['notifiable'];

            $notifiable = $event->data['notifiable'] ?? null;
            if ($notifiable) {
                $notifiableId = $notifiable->getKey();
                $notifiableType = get_class($notifiable);
            }

            $type = 'notification';
            $class = $event->data['__laravel_notification'] ?? null;
        }
        else{//mailable

            $type = 'mailable';
            $class = $event->data["__telescope_mailable"];
        }


        $email = EmailLog::create([
            'from' =>$from,
            'to' => $to,
            'cc' => $cc,
            'bcc' => $bcc,
            'subject' => $subject,
            'body' => $body,
            'attachments' => $attachments,
            'notifiable_id' => $notifiableId,
            'notifiable_type' => $notifiableType,
            'type' => $type,
            'class' => $class,
            'sent_at' => now(),
        ]);
    }
}
