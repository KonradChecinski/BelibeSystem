<?php

namespace App\Jobs\FromSubiekt\ModelTw;

use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateModelFromSubiekt implements ShouldQueue
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
        $createdModelTws = DB::connection("subiekt")->table("Belibe_System_ModelTw_Created")->get();

        foreach ($createdModelTws as $createdModelTw) {
            $modelTw = ModelTw::find($createdModelTw->id);
            $model = ProductModel::create([
                "symbol" => $modelTw->mdt_Nazwa,
                "name" => $modelTw->mdt_Nazwa,
                "description_b2b" => "",
                "description_b2c" => "",
                "description_allegro" => ""
            ]);
            $model->prices()->create([]);
            DB::connection("subiekt")->table("Belibe_System_ModelTw_Created")->where("id", $createdModelTw->id)->delete();
        }
    }
}
