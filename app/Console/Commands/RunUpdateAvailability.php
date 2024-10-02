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

        $this->info('Find ' . $products->count() . ' products');
        $count = $products->count();
        $i = 0;
        foreach ($products as $product) {
            $i++;
            $this->info($i . '.(/' . $count . ') Updating availability for product: ' . $product->symbol);
            if ($shoper) {
                $this->info('Updating Shoper availability...');
                try {
                    ShoperChangeQuantity::dispatchSync($product);
                } catch
                (\Exception $e) {
                    $this->error($e->getMessage());
                    $this->info("Waiting 1 seconds...");
                    sleep(1);
                    try {
                        $this->info('Updating Shoper availability...');
                        ShoperChangeQuantity::dispatchSync($product);
                    } catch (\Exception $e) {
                        $this->error($e->getMessage());
                    }

                }

            }
            if ($allegro) {
                $this->info('Updating Allegro availability...');
                try {
                    AllegroChangeQuantity::dispatchSync($product);
                } catch
                (\Exception $e) {
                    $this->error($e->getMessage());
                    $this->info("Waiting 1 seconds...");
                    sleep(1);
                    try {
                        $this->info('Updating Allegro availability...');
                        AllegroChangeQuantity::dispatchSync($product);
                    } catch (\Exception $e) {
                        $this->error($e->getMessage());
                    }

                }

            }
            $this->info("");
//
//            if ($i % 5 === 0) {
//                $this->info("Waiting 5 seconds...");
//                $this->info("");
//                sleep(5);
//            }
        }

        return self::SUCCESS;

    }
}
