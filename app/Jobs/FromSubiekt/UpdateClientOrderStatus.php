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
            $subiektOrder = $this->getSubiektOrder($order->subiekt_id);

            if (!$subiektOrder) {
                $this->handleMissingSubiektOrder($order);
                continue;
            }

            if ($this->isOrderCompletedWithoutFV($subiektOrder)) {
                $this->completeOrder($order);
                continue;
            }

            $subiektFV = $this->getSubiektFV($order->subiekt_id);

            if (!$subiektFV) {
                $this->handleMissingSubiektOrder($order);
                continue;
            }

            if ($this->isOrderCompletedWithFVCompleted($subiektFV)) {
                $this->completeOrder($order);
            }
        }
    }

    private function getSubiektOrder(int $subiektId)
    {
        return DB::connection("subiekt")
            ->table("dok__Dokument")
            ->where("dok_Id", $subiektId)
            ->whereIn("dok_Typ", [16])
            ->first([
                "dok_Id",
                "dok_Typ",
                "dok_Podtyp",
                "dok_DoDokId",
                "dok_NrPelny",
                "dok_Status",
                "dok_StatusFiskal"
            ]);
    }

    private function handleMissingSubiektOrder(ClientOrder $order): void
    {
        if (Carbon::now()->diffInDays($order->created_at) > 7) {
            $order->update(["status" => 0]);
        }
    }

    private function isOrderCompletedWithoutFV($subiektOrder): bool
    {
        return $subiektOrder->dok_Status == 8 && is_null($subiektOrder->dok_DoDokId);
    }

    private function completeOrder(ClientOrder $order): void
    {
        $order->update(["status" => 100]);
        $order->client->accountManager->notify(new OrderCompleatedUser($order));
    }

    private function getSubiektFV(int $subiektId)
    {
        return DB::connection("subiekt")
            ->table("dok__Dokument")
            ->where("dok_DoDokId", $subiektId)
            ->whereIn("dok_Typ", [2, 21])
            ->where("dok_Podtyp", 0)
            ->first([
                "dok_Id",
                "dok_Typ",
                "dok_NrPelny",
                "dok_Status",
                "dok_StatusFiskal"
            ]);
    }

    private function isOrderCompletedWithFVCompleted($subiektFV): bool
    {
        $subiektFVPrinted = DB::connection("subiekt")
            ->table("dok_StatusWydruku")
            ->where("dsw_IdDokumentu", $subiektFV->dok_Id)
            ->first();

        return (int)$subiektFV->dok_Status === 1 &&
            (
                ((int)$subiektFV->dok_Typ === 2 && !is_null($subiektFVPrinted)) ||
                ((int)$subiektFV->dok_Typ === 21 && (int)$subiektFV->dok_StatusFiskal === 1)
            );
    }
}
