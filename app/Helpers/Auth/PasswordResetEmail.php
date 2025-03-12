<?php

namespace App\Helpers\Auth;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;

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


}
