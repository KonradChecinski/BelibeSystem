<?php

namespace App\Jobs\ToSubiekt\Towar;

use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class DisableProductInSubiekt implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $subiekt_id;
    public $tries = 5;
    public $backoff = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(int $subiekt_id)
    {
        $this->onQueue('sfera');
        $this->subiekt_id = $subiekt_id;
    }

    public function uniqueId()
    {
        return $this->subiekt_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();


        if (is_null($this->subiekt_id)) return;

        $zablokowany = (bool)Towar::find($this->subiekt_id)->tw_Zablokowany;
        $subiektTowar = $subiekt->Towary->Wczytaj($this->subiekt_id);

        if (!$zablokowany) {
//            $subiektTowar->Aktywny = true;
//            $subiektTowar->zapisz();

            $subiektTowar->Aktywny = false;
            $subiektTowar->zapisz();
        }


        DB::connection("subiekt")->table("Belibe_System_Tw_Updated")->where("id", $this->subiekt_id)->delete();


    }
}
