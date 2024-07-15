<?php

namespace App\Notifications\b2b;

use App\Models\ClientOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class OrderPlaced extends Notification //implements ShouldQueue
{
    use Queueable;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    private ClientOrder $clientOrder;

    /**
     * Create a new notification instance.
     */
    public function __construct(ClientOrder $clientOrder)
    {
        $this->onQueue('linux');
        $this->clientOrder = $clientOrder;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $this->clientOrder->load([
            "products:products.id,products.symbol,products.quantity,products.product_size_id,products.product_unit_id,products.product_model_color_id",
            "products.size:id,name",
            "products.unit:id,name",
            "productModels:product_models.id,product_models.name,product_models.symbol",
            "productModelColors" => function ($query) {
                $query->select("product_model_colors.id",
                    "product_model_colors.shortcut",
                    "product_model_colors.name",
                    "product_model_colors.product_model_id");
                $query->withWhereHas("images", function ($query) {
                    $query->where("type", 1);
                    $query->where("order", 0);
                    $query->select("product_model_color_id", "path");
                });
            },
        ]);
        $clientOrderModel = collect([$this->clientOrder]);

        return (new MailMessage)
            ->subject("Twoje zamówienie zostało złożone")
            ->markdown("mail.b2b.orderPlaced.orderPlaced", [
                'clientOrder' => $this->clientOrder,
                'location' => $this->clientOrder->location,
                'client' => $this->clientOrder->client,
                'notifiable' => $notifiable,
                "orderProducts" => $this->clientOrder->orderProducts,
                "products" => $clientOrderModel->pluck("products")->flatten(),
                "productModels" => $clientOrderModel->pluck("productModels")->flatten()->unique("id")->values(),
                "productColors" => $clientOrderModel->pluck("productModelColors")->flatten()->unique("id")->values(),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
