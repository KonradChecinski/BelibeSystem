<?php

namespace App\Console\Commands;

use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Quantity\UpdateAllQuantities;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Products\Product;
use Illuminate\Console\Command;

class RunUpdateallQuantities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-update-quantities';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update quantities of products in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        UpdateAllQuantities::dispatch();

        return self::SUCCESS;

    }
}
