<?php

namespace App\Jobs\FromSubiekt;

use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductShowInSubiekt;
use App\Models\ClientOrder;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Notifications\b2b\OrderCompleatedUser;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdateClientOrderStatus implements ShouldQueue, ShouldBeUnique
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
        $orders = ClientOrder::query()->where("status", 90)->get();
        foreach ($orders as $order) {
            $subiektFV = DB::connection("subiekt")
                ->table("dok__Dokument")
                ->where("dok_DoDokId", $order->subiekt_id)
                ->whereIn("dok_Typ", [2, 21])
                ->where("dok_Podtyp", 0)
                ->first([
                    "dok_Id",
                    "dok_Typ",
                    "dok_NrPelny",
                    "dok_Status",
                    "dok_StatusFiskal"
                ]);

//            dd($order, $subiektFV);
            if ($subiektFV == null) {
                if (Carbon::now()->diffInDays($order->created_at) > 7) {
                    $order->update([
                        "status" => 0
                    ]);
                } else {
                    continue;
                }
            }

            $subiektFVPrinted = DB::connection("subiekt")
                ->table("dok_StatusWydruku")
                ->where("dsw_IdDokumentu", $subiektFV->dok_Id)
                ->first();

//            dd($subiektFV,$subiektFVPrinted, $subiektFV->dok_Status,
//                (int)$subiektFV->dok_Status === 1, !is_null($subiektFVPrinted));

            if (
                (int)$subiektFV->dok_Status == 1 //skutek 0-cofnięty, 1-wywołany, 3-odłożony
                &&
                (
                    ((int)$subiektFV->dok_Typ === 2 && (int)$subiektFV->dok_StatusFiskal === 1)
                    ||
                    ((int)$subiektFV->dok_Typ === 21 && !is_null($subiektFVPrinted))
                )
            ) {
                $order->update([
                    "status" => 100
                ]);
                $order->client->accountManager->notify(new OrderCompleatedUser($order));
            }

        }
    }
}
