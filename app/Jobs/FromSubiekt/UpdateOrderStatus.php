<?php

namespace App\Jobs\FromSubiekt;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class UpdateOrderStatus implements ShouldQueue
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
        $orders = Order::query()->where("status", 4)->get();
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

            if ($subiektFV->dok_Status == 1) { //skutek 0-cofnięty, 1-wywołany, 3-odłożony
                $order->update([
                    "status" => 5
                ]);
            }

        }
    }
}
