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
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdateClientOrderStatus implements ShouldQueue
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
        $orders = ClientOrder::query()->where("status", 4)->get();
        foreach ($orders as $order) {
            $subiektFV = DB::connection("subiekt")
                ->table("dok__Dokument")
                ->where("dok_DoDokId", $order->subiekt_id)
                ->whereIn("dok_Typ", [2, 21])
                ->where("dok_Podtyp", 0)
                ->first([
                    "dok_Id",
                    "dok_NrPelny",
                    "dok_Status",
                ]);

//            dd($order, $subiektFV);
            if ($subiektFV == null) {
                if (Carbon::now()->diffInDays($order->created_at) > 7) {
                    $order->update([
                        "status" => 6
                    ]);
                } else {
                    continue;
                }
            }

            $subiektFVPrinted = DB::connection("subiekt")
                ->table("dok_StatusWydruku")
                ->where("dsw_IdDokumentu", $order->subiekt_id)
                ->first();

            if ($subiektFV->dok_Status == 1 && !is_null($subiektFVPrinted)) { //skutek 0-cofnięty, 1-wywołany, 3-odłożony
                $order->update([
                    "status" => 5
                ]);
                $order->client->accountManager->notify(new OrderCompleatedUser($order));
            }

        }
    }
}
