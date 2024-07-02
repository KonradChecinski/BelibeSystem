<?php

namespace App\Jobs\FromSubiekt\Finanse;

use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class DeleteSettlementsFromSubiekt implements ShouldQueue
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
        $updatedSettlements = DB::connection("subiekt")->table("Belibe_System_Finanse_Deleted")->get();

        foreach ($updatedSettlements as $updatedSettlement) {
            $settlement = ClientSettlement::query()->where("subiekt_id", $updatedSettlement->id)->first();
            if (is_null($settlement)) {
                DB::connection("subiekt")->table("Belibe_System_Finanse_Deleted")->where("id", $updatedSettlement->id)->delete();
                continue;
            }

            $settlement->delete();

            DB::connection("subiekt")->table("Belibe_System_Finanse_Deleted")->where("id", $updatedSettlement->id)->delete();
        }
    }
}
