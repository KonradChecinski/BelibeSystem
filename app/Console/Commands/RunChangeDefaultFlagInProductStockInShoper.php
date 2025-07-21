<?php

namespace App\Console\Commands;

use App\Helpers\Shoper\Shoper;
use App\Jobs\ToSubiekt\ZestawienieSprzedazySklepy;
use App\Models\Products\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class RunChangeDefaultFlagInProductStockInShoper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-change-default-flag-in-product-stock-in-shoper';

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
        $this->info('Starting job to change default flag in product stock in Shoper...');

        $products = Product::query()->where("show_in_b2c", 1)->get();

        $this->info('Find ' . $products->count() . ' products');
        $count = $products->count();
        $i = 0;
        foreach ($products as $product) {
            $i++;
            $this->info($i . '.(/' . $count . ') Updating availability for product: ' . $product->symbol);

            $this->info('Updating Shoper availability...');
            try {
                $shoperStock = Shoper::getProductStockBySymbol($product);
                if (count($shoperStock) > 0) {
                    $shoperStockId = $shoperStock[0]["stock_id"];
                    Shoper::changeStockDefault($shoperStockId, true);
                }
            } catch
            (\Exception $e) {
                $this->error($e->getMessage());
                $this->info("Waiting 3 seconds...");
                sleep(3);
            }


            $this->info("");

            if ($i % 5 === 0) {
                $this->info("Waiting 5 seconds...");
                $this->info("");
                sleep(5);
            }
        }

        return self::SUCCESS;

    }
}
