<?php

namespace App\Helpers\Auth;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;
use Symfony\Component\Mime\Email;

class PasswordResetEmail extends VerifyEmail
{
    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param string $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url): MailMessage
    {
        return (new MailMessage)
            ->subject(Lang::get('Your password has been reset'))
            ->line(Lang::get('Your password has been reset'))
            ->line(Lang::get('If you did not request a password reset, please contact your administrator.'));
    }

    /**
     * Ensure notifiable context is embedded into the Symfony Email so it can be logged later.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $mail = parent::toMail($notifiable);

        return $mail->withSymfonyMessage(function (Email $message) use ($notifiable) {
            $headers = $message->getHeaders();
            $headers->addTextHeader('X-Notifiable-Id', (string) $notifiable->getKey());
            $headers->addTextHeader('X-Notifiable-Type', get_class($notifiable));
            $headers->addTextHeader('X-Laravel-Notification', static::class);
        });
    }
}
