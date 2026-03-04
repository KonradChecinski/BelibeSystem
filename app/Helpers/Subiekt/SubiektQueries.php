<?php

namespace App\Helpers\Subiekt;

use App\Models\Subiekt\Towar;
use Illuminate\Database\Query\Builder;
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
            ->where("tw_Ilosc", ">", 0)->whereNotNull("tw_Id")
            ->get([
                "tw_Id",
                "tw_Zablokowany",
                "tw_Symbol",
                "tw_Nazwa",
                "tw_Ilosc"
            ]);

        return $twSale;
    }


    public static function whatRemainInInvoiceAfterCorrections(int $warehouse_id, int $product_id, int $client_id): \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection|array
    {
        $subQuery1 = DB::connection("subiekt")
            ->table("vwZstSprzWgKhnt", "subq")
            ->leftJoin("tw__Towar", "ob_TowId", "tw_Id")
            ->leftJoin("adr_Historia", "dok_PlatnikAdreshId", "adrh_Id")
            ->leftJoin("adr__Ewid", "adrh_IdAdresu", "adr_Id")
            ->select([
                DB::raw("ISNULL(SUM(ob_IloscMag * ob_Znak),0) as zw_Ilosc"),
            ])
            ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                $query
                    ->where("adr_TypAdresu", 1)
                    ->orWhereNull("dok_PlatnikAdreshId");
            })
            ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                $query
                    ->whereIn("TypDlugi", [
                        393216,
                        393217,
                        393218,
                        4390912,
                        4390913,
                        917504,
                        917505
                    ])
                    ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                        $query
                            ->where("adr_TypAdresu", 1)
                            ->where("adr_IdObiektu", $client_id);
                    })
                    ->where("tw_Id", $product_id)
                    ->where("dok_MagId", $warehouse_id)
                    ->where("dok_DoDokId", DB::raw("q.dok_Id"));
            })
            ->groupBy([
                "dok_DoDokId",
                "tw_Id",
                "tw_Symbol"
            ]);


        $subQuery2 = DB::connection("subiekt")
            ->table("vwZstSprzWgKhnt", "q")
            ->leftJoin("tw__Towar", "ob_TowId", "tw_Id")
            ->leftJoin('dok_Pozycja as poz', function ($join) {
                $join->on('poz.ob_DokHanId', '=', 'q.dok_Id')
                    ->on('poz.ob_TowId', '=', 'q.ob_TowId');
            })
            ->leftJoin("adr_Historia", "dok_PlatnikAdreshId", "adrh_Id")
            ->leftJoin("adr__Ewid", "adrh_IdAdresu", "adr_Id")
            ->select([
                "dok_Id",
                "tw_Id",
                "poz.ob_DokMagLp",
                DB::raw("SUM(q.ob_IloscMag * q.ob_Znak) as sp_Ilosc"),
                "ob_CenaNetto",
                "ob_CenaBrutto"
            ])
            ->selectSub($subQuery1, "zw_Ilosc")
            ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                $query
                    ->where("adr_TypAdresu", 1)
                    ->orWhereNull("dok_PlatnikAdreshId");
            })
            ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                $query
                    ->whereDate("dok_DataWyst", ">", Carbon::now()->subYear())
                    ->whereIn("TypDlugi", [
                        131072,
                        131075,
                        131077,
                        131074,
                        4063232,
                        262144,
                        1376256,
                        1376258,
                        1376257,
                        1376259
                    ])
                    ->where(function (Builder $query) use ($warehouse_id, $product_id, $client_id) {
                        $query
                            ->where("adr_TypAdresu", 1)
                            ->where("adr_IdObiektu", $client_id);
                    })
                    ->where("tw_Id", $product_id)
                    ->where("dok_MagId", $warehouse_id);
            })
            ->groupBy([
                "dok_Id",
                "tw_Id",
                "poz.ob_DokMagLp",
                "tw_Symbol",
                "ob_CenaNetto",
                "ob_CenaBrutto"
            ]);
//        dd($subQuery2->get());

        $query = DB::connection("subiekt")
            ->query()
            ->fromSub($subQuery2, "a")
            ->select([
                DB::raw("a.*"),
                DB::raw("(a.sp_ilosc + ISNULL(a.zw_Ilosc,0)) as suma_Ilosc"),
            ]);

        return $query->get();
    }


    public static function getActiveWarehouse(): \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection|array
    {
        return DB::connection("subiekt")
            ->table("sl_Magazyn")
            ->where("mag_status", 1)
            ->get([
                "mag_Id",
                "mag_Symbol",
                "mag_Nazwa"
            ]);
    }

    public static function getDocumentCategory(): \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection|array
    {
        return DB::connection("subiekt")->table("sl_Kategoria")->get([
            "kat_Id",
            "kat_Nazwa"
        ]);
    }

    public static function getDocumentNameById(int $id): string
    {
        return DB::connection("subiekt")->table("dok__Dokument")->where("dok_Id", $id)->first("dok_NrPelny")->dok_NrPelny;
    }

    public static function getClientIdByNip(string $nip): int|null
    {
        return DB::connection("subiekt")->table("adr__Ewid")
            ->where("adr_TypAdresu", 1)
            ->where("adr_Nip", $nip)
            ->orderBy("adr_Id", "desc")
            ->first("adr_IdObiektu")?->adr_IdObiektu;
    }
}
