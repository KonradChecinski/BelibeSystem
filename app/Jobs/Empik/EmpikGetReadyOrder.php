<?php

namespace App\Jobs\Empik;

use App\Helpers\Empik\Empik;
use App\Jobs\ToSubiekt\OrderCreateInSubiekt;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class EmpikGetReadyOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;


    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        $orders = Order::query()->where("type", 3)->where('status', 10)->get();
        foreach ($orders as $order) {
            $response = Empik::getReadyOrder($order->order_id);
            if (!$response) {
                $this->fail('getting ready order failed');
            }

            $empikOrder = $response->json()["orders"][0];
            $empikOrderObject = json_decode(json_encode($empikOrder));

            $order->update([

                "company" => Str::title($empikOrderObject->customer->billing_address->company),
                "city" => Str::title($empikOrderObject->customer->billing_address->city),
                "postcode" => $empikOrderObject->customer->billing_address->zip_code,
                "street1" => Str::title($empikOrderObject->customer->billing_address->street_1) . ($empikOrderObject->customer->billing_address->street_2 ? " " . Str::title($empikOrderObject->customer->billing_address->street_2) : ""),
                "country" => Str::title($empikOrderObject->customer->billing_address->country),
                "phone" => $empikOrderObject->customer->billing_address->phone,
                "tax_id" => $empikOrderObject->customer?->organization?->tax_identification_number,

                "status" => 20,//20 - gotowe do wysyłki
            ]);
        }

        OrderCreateInSubiekt::dispatch();

    }
}
