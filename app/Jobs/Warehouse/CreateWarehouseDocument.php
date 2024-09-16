<?php

namespace App\Jobs\Warehouse;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Warehouse\Warehouse;
use App\Mail\WarehouseDocumentCreated;
use App\Models\ClientOrder;
use App\Models\Partner;
use App\Models\PartnerExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CreateWarehouseDocument implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

    public ClientOrder $clientOrder;

    /**
     * Create a new job instance.
     */
    public function __construct(ClientOrder $clientOrder)
    {
        $this->onQueue('linux');
        $this->clientOrder = $clientOrder;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $warehouseDocument = Warehouse::transformClientOrderToWarehouseDocument($this->clientOrder);
        if (!$warehouseDocument) {
            $this->fail('Export file failed');
        }

        $this->clientOrder->status = 50;
        $this->clientOrder->save();

        //TODO: Add dynamic mail
        Mail::to("sprzedaz@belibe.pl")->send(new WarehouseDocumentCreated($warehouseDocument));
    }
}
