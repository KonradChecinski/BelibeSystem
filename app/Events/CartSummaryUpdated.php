<?php

namespace App\Events;

use App\Helpers\Helper;
use App\Models\Client\Client;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CartSummaryUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $cartSummary;
    private int $clientId;

    /**
     * Create a new event instance.
     */
    public function __construct(int $clientId)
    {
        $this->clientId = $clientId;
        $this->cartSummary = Helper::getCartSummary();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('cart.summary.' . $this->clientId),
        ];
    }
}
