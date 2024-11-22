<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\ProductModel;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ChangeSubiektInModelInSubiekt implements ShouldQueue, ShouldBeUnique
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
        $this->onQueue('sfera');
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
//        $model = ModelTw::findByName($this->productModel->symbol);
//        $towary = $model->towar;


        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $products = $this->productModel->products;


        foreach ($products as $product) {
            if (is_null($product->subiekt_id)) continue;

            $zablokowany = (bool)Towar::find($product->subiekt_id)->tw_Zablokowany;
            $subiektTowar = $subiekt->Towary->Wczytaj($product->subiekt_id);

            if ($zablokowany) {
                $subiektTowar->Aktywny = true;
                $subiektTowar->zapisz();
            }

//            $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name,0, 50));
            $subiektTowar->Pole1 = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name_6_char, 0, 50));
            $subiektTowar->Pole2 = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name_11_char, 0, 50));
            $subiektTowar->GrupaId = $this->productModel->group->id;


            $subiektTowar->zapisz();

            if ($zablokowany) {
                $subiektTowar->Aktywny = false;
                $subiektTowar->zapisz();
            }
            DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $product->subiekt_id)->delete();


        }

    }
}
