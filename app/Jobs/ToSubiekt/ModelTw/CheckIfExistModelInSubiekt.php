<?php

namespace App\Jobs\ToSubiekt\ModelTw;

use App\Models\Products\ProductModel;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\ModelTw;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CheckIfExistModelInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $models = ProductModel::all();
        foreach ($models as $model) {
            $modelTw = ModelTw::findByName($model->symbol);
            if (is_null($modelTw)) {
                CreateModelInSubiekt::dispatch($model);
            }
        }
    }
}
