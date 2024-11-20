<?php

namespace App\Helpers\Auth;

trait ExtendedMustVerifyEmail
{
    use \Illuminate\Auth\MustVerifyEmail;

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new ExtendedVerifyEmail);
    }

}
