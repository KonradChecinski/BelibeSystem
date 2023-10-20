<?php

namespace App\Jobs\FromSubiekt\Tw;

use App\Jobs\ToSubiekt\Towar\ChangePriceInModelInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductShowInSubiekt;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductSize;
use App\Models\Products\ProductUnit;
use App\Models\Subiekt\DaneDodatkowe;
use App\Models\Subiekt\ModelTw;
use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateTwFromSubiekt implements ShouldQueue
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
        $createdTws = DB::connection("subiekt")->table("Belibe_System_Tw_Created")->get();

        foreach ($createdTws as $createdTw) {
            $product = Product::findBySubiektId($createdTw->id);

            $towar = Towar::find($createdTw->id);
            if (is_null($towar)) {
                DB::connection("subiekt")->table("Belibe_System_Tw_Created")->where("id", $createdTw->id)->delete();
                continue;
            }

            if ($towar->model->count() == 0) {
                DB::connection("subiekt")->table("Belibe_System_Tw_Created")->where("id", $createdTw->id)->delete();
                continue;
            }

            $modelTw = $towar->model->first();
            $model = ProductModel::where("symbol", $modelTw->mdt_Nazwa)->first();

            if (is_null($model)) {
                if ($this->attempts() < 5) throw new \Exception();

                DB::connection("subiekt")->table("Belibe_System_Tw_Created")->where("id", $createdTw->id)->delete();
                continue;
            }

            $colorTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $createdTw->id)->first()->pwd_Tekst02;
            $sizeTw = DaneDodatkowe::where("pwd_TypObiektu", -14)->where("pwd_IdObiektu", $createdTw->id)->first()->pwd_Tekst04;
            $color = $model->colors()->where("shortcut", $colorTw)->first();

            if (is_null($product)) {
                $product = new Product([
                    "symbol" => $towar->tw_Symbol,
                    "name" => $towar->tw_Nazwa,
                    "subiekt_id" => $towar->tw_Id,
                    "show_in_subiekt" => !(bool)$towar->tw_Zablokowany
                ]);

                $size = ProductSize::where("name", $sizeTw)->first();
                $unit = ProductUnit::where("name", "szt")->first();

                $product->size()->associate($size);
                $product->unit()->associate($unit);
                $color->products()->save($product);
            } else {
                $product->update([
                    "name" => $towar->tw_Nazwa,
                    "subiekt_id" => $towar->tw_Id,
                    "show_in_subiekt" => !(bool)$towar->tw_Zablokowany
                ]);

                $product->barcodes()->delete();
            }

            $barcodes = [
                $towar->tw_PodstKodKresk,
            ];
            foreach (DB::connection("subiekt")->table("tw_KodKreskowy")->where("kk_IdTowar", $createdTw->id)->get()->map(function ($e) {
                return $e->kk_Kod;
            })->toArray() as $item) {
                array_push($barcodes, $item);
            }

            foreach ($barcodes as $id => $barcodeValue) {
                if (substr($barcodeValue, 0, 9) == "590185425" || substr($barcodeValue, 0, 8) == "59032053") {
                    $barcode = new ProductBarcode([
                        'barcode' => $barcodeValue,
                        'type' => 1,
                    ]);
                } elseif ($barcodeValue >= 1000000000009 && $barcodeValue < 2000000000000) {
                    $barcode = new ProductBarcode([
                        'barcode' => $barcodeValue,
                        'type' => 2,
                    ]);
                } else {
                    $barcode = new ProductBarcode([
                        'barcode' => $barcodeValue,
                        'type' => 3,
                    ]);
                }

                $barcode->main = $id == 0;
                $barcode->product()->associate($product);
                $barcode->save();
            }

            DB::connection("subiekt")->table("Belibe_System_Tw_Created")->where("id", $createdTw->id)->delete();

            ChangeProductInSubiekt::dispatch($product);
            ChangeProductShowInSubiekt::dispatch($product);
            ChangePriceInModelInSubiekt::dispatch($product->model);
        }
    }
}
