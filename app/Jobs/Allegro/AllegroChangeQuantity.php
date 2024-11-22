<?php

namespace App\Jobs\Allegro;

use App\Helpers\Allegro\Allegro;
use App\Models\Products\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AllegroChangeQuantity implements ShouldQueue, ShouldBeUnique
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
     */
    public function handle(): void
    {
        $response = Allegro::searchOffer($this->product)->json();

        if ($response['count'] > 0) {
            $offer = $response['offers'];
            $offer = json_decode(json_encode($offer));
            $offer = $offer[0];

            $available = $this->product->available_b2c;

            if ($available > 0) {
                Allegro::changeQuantityInOffer($offer->id, $this->product);
                if ($offer->publication->status === "ENDED") {
                    Allegro::changeStatusInOffer(allegroId: $offer->id, active: true);
                }
            }

            if ($available === 0 && $offer->publication->status === "ACTIVE") {
                Allegro::changeStatusInOffer(allegroId: $offer->id, active: false);
            }

        }

    }

    public function failed(\Throwable $exception)
    {
        // Send user notification of failure, etc...
        //TODO: Add logging (send mail)
    }

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return $this->product->id;
    }
}
