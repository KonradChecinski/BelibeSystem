<?php

namespace App\Jobs\ToSubiekt;

use App\Models\Subiekt\Towar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ZestawienieSprzedazySklepy implements ShouldQueue
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
        // Utworzenie obiektu Carbon z aktualną datą i czasem
        $now = Carbon::now();
        $magazyn = 17;
        $od = Carbon::create($now->year, 6, 30, 0, 0, 0);
        $do = Carbon::create($now->year, 7, 1, 23, 59, 59);

        $subQueryReturns = DB::connection("subiekt")
            ->table("dok_Pozycja")
            ->select([
                DB::raw("Ob_TowId as Tow_Id"),
                DB::raw("-1* sum(Ob_Ilosc) as Tw_Ilosc"),
            ])
            ->whereIn("ob_DokHanId", function ($query) use ($magazyn, $od, $do) {
                return $query->select("dok_Id")
                    ->from("dok__Dokument")
                    ->where("dok_MagId", $magazyn)
                    ->where("dok_Typ", 14)
                    ->where("dok_DataWyst", ">=", $od->ToDateString())
                    ->where("dok_DataWyst", "<=", $do->ToDateString());
            })
            ->groupBy("Ob_TowId");
//        dd($subQueryReturns->toSql(), $subQueryReturns->get());

//        $twReturns = Towar::query()
//            ->rightJoinSub($subQueryReturns, "s1", "tw__Towar.tw_Id", "=", "Tow_Id")
//            ->get([
//                "tw_Id",
//                "tw_Symbol",
//                "tw_Nazwa",
//                "Tw_Ilosc"
//            ]);


        $subQuerySale = DB::connection("subiekt")
            ->table("dok_Pozycja")
            ->select([
                DB::raw("Ob_TowId as Tow_Id"),
                DB::raw("sum(Ob_Ilosc) as Tw_Ilosc"),
            ])
            ->whereIn("ob_DokHanId", function ($query) use ($magazyn, $od, $do) {
                return $query->select("dok_Id")
                    ->from("dok__Dokument")
                    ->where("dok_MagId", $magazyn)
                    ->where(function ($query) {
                        return $query->where("dok_Typ", 2)
                            ->orWhere("dok_Typ", 21);
                    })
                    ->where("dok_DataWyst", ">=", $od->ToDateString())
                    ->where("dok_DataWyst", "<=", $do->ToDateString());
            })
            ->groupBy("Ob_TowId");
//        $twSale = Towar::query()
//            ->rightJoinSub($subQuerySale, "s1", "tw__Towar.tw_Id", "=", "Tow_Id")->get([
//                "tw_Id",
//                "tw_Symbol",
//                "tw_Nazwa",
//                "Tw_Ilosc"
//            ]);
//        dd($twSale);

        $union = $subQueryReturns->union($subQuerySale);

//        $result = DB::connection("subiekt")
//            ->query()
//            ->fromSub($subQueryReturns, "s1")
//            ->join($subQuerySale, "s2");

//        dd($result->toSql());
        dd($subQueryReturns->toSql(), $subQuerySale->toSql());

//        if ($result === 0) {
//            $this->fail("Nie udało się zaktualizować daty blokady miesięcznej");
//        }
    }
}
