<?php

namespace App\Console\Commands;

use App\Helpers\Shoper\Shoper;
use App\Jobs\Shoper\ShoperChangeShow;
use App\Jobs\ToSubiekt\ZestawienieSprzedazySklepy;
use App\Models\Products\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class RunAddOnlyNotExistProductStockInShoper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-add-only-not-exist-product-stock-in-shoper';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting job to add product stock in Shoper...');

        $products = Product::query()->where("show_in_b2c", 1)->get();

        $this->info('Find ' . $products->count() . ' products');
        $count = $products->count();
        $i = 0;
        foreach ($products as $product) {
            $i++;

            if ($i % 5 === 0) {
                $this->info("Waiting 5 seconds...");
                $this->info("");
                sleep(5);
            }

            $this->info($i . '.(/' . $count . ') Checking product stock: ' . $product->symbol);
            try {
                $shoperStock = Shoper::getProductStockBySymbol($product);
            } catch
            (\Exception $e) {
                $this->error($e->getMessage());
                $this->info("Waiting 3 seconds...");
                sleep(3);
                $shoperStock = Shoper::getProductStockBySymbol($product);
            }


            if (!is_null($shoperStock) && count($shoperStock) > 0) {
                $this->info("Product stock already exists in Shoper, skipping...");
                continue;
            }

            $this->info($i . '.(/' . $count . ') Adding product stock: ' . $product->symbol);


            ShoperChangeShow::dispatch($product->id);


            $this->info("");


        }

        return self::SUCCESS;

    }
}
