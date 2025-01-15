<?php

namespace App\Console\Commands;

use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Shoper\ShoperChangeImages;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Products\Product;
use App\Models\Products\ProductModelColor;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Console\Command;

class UpdateBadFormatImageInShoper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-bad-format-image-in-shoper';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update bad format image in shoper';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $productModelColors = ProductModelColor::query()
            ->whereHas('products', function ($query) {
                $query->where("show_in_b2c", true);
            })
            ->whereHas('images', function ($query) {
                $query
                    ->where("type", 1)
                    ->whereIn("order", [0, 1, 2, 3])
                    ->where(function ($query) {
                        $query
                            ->where("width", "!=", 1280)
                            ->orWhere("height", "!=", 1920);
                    });

            })
            ->with(['products'])
            ->with(['images' => function ($query) {
                $query
                    ->where("type", 1)
                    ->whereIn("order", [0, 1, 2, 3])
                    ->where(function ($query) {
                        $query
                            ->where("width", "!=", 1280)
                            ->orWhere("height", "!=", 1920);
                    });
            }])
            ->get();

        foreach ($productModelColors as $id => $productModelColor) {
            if ($id % 20 === 0) {
                sleep(10);
            }
            ShoperChangeImages::dispatch(ProductModelColor::find($productModelColor->id));
            $this->info("Zlecono zmiany");
            sleep(1);
        }

        return self::SUCCESS;

    }
}
