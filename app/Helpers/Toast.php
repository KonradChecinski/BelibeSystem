<?php

namespace App\Helpers;

class Toast
{
    private ToastType $type;
    private string $message;

    public function __construct(ToastType $type, string $message)
    {
        $this->type = $type;
        $this->message = $message;
    }

    public function getToast(): string
    {
        return "['toast' => ['type' => " . $this->type->value . ", 'message' => " . $this->message . "]]";
    }
}
