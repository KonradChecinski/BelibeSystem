<?php

namespace App\Helpers\Subiekt;

use App\Models\Subiekt\Towar;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SubiektQueries
{
    public static function saleInWarehouse(int $warehouseId, Carbon $from, Carbon $to): \Illuminate\Database\Eloquent\Collection|array
    {
        $subQueryReturns = DB::connection("subiekt")
            ->table("dok_Pozycja")
            ->select([
                DB::raw("Ob_TowId as tow_Id"),
                DB::raw("-1* sum(Ob_Ilosc) as tw_Ilosc"),
            ])
            ->whereIn("ob_DokHanId", function ($query) use ($warehouseId, $from, $to) {
                return $query->select("dok_Id")
                    ->from("dok__Dokument")
                    ->where("dok_MagId", $warehouseId)
                    ->where("dok_Typ", 14)
                    ->where("dok_DataWyst", ">=", $from->ToDateString())
                    ->where("dok_DataWyst", "<=", $to->ToDateString());
            })
            ->groupBy("Ob_TowId");


        $subQuerySale = DB::connection("subiekt")
            ->table("dok_Pozycja")
            ->select([
                DB::raw("Ob_TowId as tow_Id"),
                DB::raw("sum(Ob_Ilosc) as tw_Ilosc"),
            ])
            ->whereIn("ob_DokHanId", function ($query) use ($warehouseId, $from, $to) {
                return $query->select("dok_Id")
                    ->from("dok__Dokument")
                    ->where("dok_MagId", $warehouseId)
                    ->where(function ($query) {
                        return $query->where("dok_Typ", 2)
                            ->orWhere("dok_Typ", 21);
                    })
                    ->where("dok_DataWyst", ">=", $from->ToDateString())
                    ->where("dok_DataWyst", "<=", $to->ToDateString());
            })
            ->groupBy("Ob_TowId");

        $union = $subQueryReturns->union($subQuerySale);

        $unionMerge = DB::connection("subiekt")->query()
            ->fromSub($union, "union")
            ->select([
                "tow_Id",
                DB::raw("SUM(tw_Ilosc) as tw_Ilosc")
            ])
            ->groupBy("tow_Id");


        $twSale = Towar::query()
            ->rightJoinSub($unionMerge, "union_Merge", "tw__Towar.tw_Id", "=", "tow_Id")
            ->where("tw_Ilosc", ">", 0)
            ->get([
                "tw_Id",
                "tw_Symbol",
                "tw_Nazwa",
                "tw_Ilosc"
            ]);

        return $twSale;
    }
}
