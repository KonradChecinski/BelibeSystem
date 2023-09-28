<?php

namespace App\Jobs;

use App\Models\Products\ProductModel;
use App\Models\Subiekt\ModelTw;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ChangePriceInModelInSubiekt //implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productModel;

    /**
     * Create a new job instance.
     */
    public function __construct(ProductModel $productModel)
    {
        $this->productModel=$productModel;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $model = ModelTw::findByName($this->productModel->symbol);
        $towary = $model->towar;


        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        foreach ($towary as $towar) {
            $zablokowany = (bool)$towar->tw_Zablokowany;
            $subiektTowar = $subiekt->Towary->Wczytaj($towar->tw_Id);

            if($zablokowany) {
                $subiektTowar->Aktywny = true;
                $subiektTowar->zapisz();
            }

            $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name,0, 50));
            $subiektTowar->Pole1 = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name_6_char,0, 50));
            $subiektTowar->Pole2 = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name_11_char,0, 50));
            $subiektTowar->GrupaId = $this->productModel->group->id;


            $subiektTowar->zapisz();

            if($zablokowany) {
                $subiektTowar->Aktywny = false;
                $subiektTowar->zapisz();
            }
        }

        dd($this->productModel, $model, $towary);
    }
}
