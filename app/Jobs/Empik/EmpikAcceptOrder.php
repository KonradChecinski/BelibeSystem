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
use Illuminate\Support\Collection;

class EmpikAcceptOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 10;
    public $backoff = 20;

    private Order $order;
    private Collection $orderItems;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order, Collection $orderItems)
    {
        $this->onQueue('linux');
        $this->order = $order;
        $this->orderItems = $orderItems;
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        $result = Empik::acceptOrder($this->order->order_id, $this->orderItems);
        if (!$result) {
            $this->fail('accepting order failed');
        }


        $this->order->status = 10;//10 - zaakceptowane
        $this->order->save();

    }
}
