<?php

namespace App\Helpers\Auth;

trait NotifyPasswordReset
{
    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailPasswordResetNotification(): void
    {
        $this->notify(new PasswordResetEmail);
    }

}
