<?php

namespace App\Console\Commands;

use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Products\Product;
use Illuminate\Console\Command;

class RunUpdateAvailability extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-update-availability';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update availability of products in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $shoper = $this->ask('Update Shoper availability?', true);
        $allegro = $this->ask('Update Allegro availability?', true);

        $products = Product::query()->where("show_in_b2c", 1)->get();
        $i = 0;
        foreach ($products as $product) {
            $i++;
            $this->info('Updating availability for product: ' . $product->symbol);
            if ($shoper) {
                $this->info('Updating Shoper availability...');
                ShoperChangeQuantity::dispatch($product);
            }
            if ($allegro) {
                $this->info('Updating Shoper availability...');
                AllegroChangeQuantity::dispatch($product);
            }
            $this->info("");

            if ($i % 10 === 0) {
                $this->info("Waiting 5 seconds...");
                $this->info("");
                sleep(5);
            }
        }

    }
}
