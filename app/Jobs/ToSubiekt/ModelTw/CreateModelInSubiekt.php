<?php

namespace App\Jobs\ToSubiekt\ModelTw;

use App\Models\Products\ProductModel;
use App\Models\Subiekt\Cena;
use App\Models\Subiekt\ModelTw;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateModelInSubiekt implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productModel;
    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModel $productModel)
    {
        $this->onQueue('linux');
        $this->productModel = $productModel;
    }

    public function uniqueId()
    {
        return $this->productModel->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $lastModel = ModelTw::orderBy('mdt_Id', 'desc')->first();

        ModelTw::create([
            "mdt_Id" => $lastModel->mdt_Id + 1,
            "mdt_Nazwa" => $this->productModel->symbol
        ]);

        DB::connection("subiekt")->table("Belibe_System_ModelTw_Created")->where("id", $lastModel->mdt_Id + 1)->delete();

    }
}
