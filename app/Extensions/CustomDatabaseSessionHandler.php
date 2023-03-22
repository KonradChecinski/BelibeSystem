<?php

namespace App\Extensions;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Session\DatabaseSessionHandler;
use Illuminate\Support\Facades\Session;

class CustomDatabaseSessionHandler extends DatabaseSessionHandler
{
    /**
     * Add the user information to the session payload.
     *
     * @param array $payload
     * @return $this
     * @throws BindingResolutionException
     */
    protected function addUserInformation(&$payload): static
    {
        if ($this->container->bound(Guard::class)) {
            info(($this->user() ? get_class($this->user()) : null));
            $payload['userable_type'] = $this->user() ? get_class($this->user()) : null;
            $payload['userable_id'] = $this->userId();

            $payload['auth_background'] = Session::has('auth_background') ? Session::get('auth_background') : rand(1,5);
        }

        return $this;
    }

    /**
     * Get the currently authenticated user's ID.
     *
     * @return mixed
     * @throws BindingResolutionException
     */
    protected function user(): mixed
    {
        return $this->container->make(Guard::class)->user();
    }
}
