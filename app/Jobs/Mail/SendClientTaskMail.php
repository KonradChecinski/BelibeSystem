<?php

namespace App\Jobs\Mail;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendClientTaskMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = 20;
    public $timeout = 60;

//    private Partner $partner;
//    private PartnerExport $partnerExport;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('linux');
//        $this->partner = $partner;
//        $this->partnerExport = $partnerExport;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
//        $result = PartnerExportFile::makeFile($this->partner, $this->partnerExport);
//        if (!$result) {
//            $this->fail('Export file failed');
//        }
    }
}
