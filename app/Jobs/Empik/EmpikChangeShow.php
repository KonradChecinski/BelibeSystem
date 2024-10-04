<?php

namespace App\Jobs\Empik;

use App\Helpers\Shoper\Shoper;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EmpikChangeShow implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    private Product $product;
    private bool $value;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productId, bool $value)
    {
        $this->onQueue('linux');
        $this->product = Product::find($productId);
        $this->value = $value;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->value) {
            $stat = $this->product->b2cStat;

            if (is_null($stat)) {
                $this->product->b2cStat()->create([
                    'create_in_empik' => 1
                ]);
            } else {
                $stat->update([
                    'create_in_empik' => 1
                ]);
            }


        }

    }
}
