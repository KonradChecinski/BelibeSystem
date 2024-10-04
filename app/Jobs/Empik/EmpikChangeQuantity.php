<?php

namespace App\Jobs\Empik;

use App\Helpers\Empik\Empik;
use App\Jobs\ToSubiekt\OrderCreateInSubiekt;
use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EmpikChangeQuantity implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private Product $product;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->onQueue('linux');
        $this->product = $product;
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        if ($this->product->show_in_empik == 0) return;
        $this->product->b2cStat->update([
            'update_in_empik' => 1,
        ]);

    }
}
