<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\Product;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateTowarInSubiekt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $product;
    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->onQueue('sfera');
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $productSubiekt = Towar::where("tw_Symbol", $this->product->symbol)->first();

        if ($productSubiekt == null) {

            $subiekt = app(Subiekt::class)->getInstance();
            $subiekt = $subiekt->connect();

            $subiektTowar = $subiekt->Towary->Dodaj(1);

            $subiektTowar->Symbol = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->symbol, 0, 30));
            $subiektTowar->Nazwa = iconv("UTF-8", "Windows-1250//IGNORE", mb_substr($this->product->name, 0, 50));
            $subiektTowar->zapisz();

            $this->product->update([
                "subiekt_id" => $subiektTowar->Identyfikator,
                "show_in_subiekt" => true
            ]);
            $productSubiekt = Towar::find($subiektTowar->Identyfikator);

            $modelTwId = DB::connection("subiekt")->table("sl_ModelTowar")->orderByDesc("mtw_Id")->first()->mtw_Id;
            $modelTw = ModelTw::findByName($this->product->model->symbol);
            DB::connection("subiekt")->table("sl_ModelTowar")->insert([
                "mtw_Id" => $modelTwId + 1,
                "mtw_IdModel" => $modelTw->mdt_Id,
                "mtw_IdTowar" => $productSubiekt->tw_Id
            ]);

        } else {
            $this->product->update([
                "subiekt_id" => $productSubiekt->tw_Id,
                "show_in_subiekt" => true
            ]);
        }


        DB::connection("subiekt")->table("Belibe_System_Tw_Created")->where("id", $productSubiekt->tw_Id)->delete();

        ChangeProductInSubiekt::dispatch($this->product->id)->delay(now()->addSeconds(5));
        ChangePriceInModelInSubiekt::dispatch($this->product->model)->delay(now()->addSeconds(10));
        ChangeB2CInModelInSubiekt::dispatch($this->product->model)->delay(now()->addSeconds(10));
        ChangeBasicInModelInSubiekt::dispatch($this->product->model)->delay(now()->addSeconds(10));
        ChangeSubiektInModelInSubiekt::dispatch($this->product->model)->delay(now()->addSeconds(10));
    }
}
