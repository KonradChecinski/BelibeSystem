<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\B2cCategory;
use App\Models\Products\ProductModel;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ChangeB2CInModelInSubiekt implements ShouldQueue
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

//            $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->name, 0, 50));
            $description_b2c = $this->productModel->description_b2c;
            $description_b2c = str_replace('[{$color$}]', $product->color->name, $description_b2c);
            $description_b2c = str_replace('[{$size$}]', $product->size->name, $description_b2c);

            $subiektTowar->Charakterystyka = iconv("UTF-8", "Windows-1250//IGNORE", $description_b2c);
//            $subiektTowar->PoleWlasne["KategoriaGlowna"] = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->productModel->b2cCategory->name, 0, 255));

            $subiektTowar->zapisz();

            if ($zablokowany) {
                $subiektTowar->Aktywny = false;
                $subiektTowar->zapisz();
            }

            DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $product->subiekt_id)->delete();

        }

    }
}
