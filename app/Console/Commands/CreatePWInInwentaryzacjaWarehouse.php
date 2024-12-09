<?php

namespace App\Console\Commands;

use App\Jobs\Allegro\AllegroChangeQuantity;
use App\Jobs\Shoper\ShoperChangeQuantity;
use App\Models\Client\Client;
use App\Models\ClientInvoice;
use App\Models\ClientSettlement;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Models\SubiektObligation;
use App\Models\SubiektReceivable;
use App\Singleton\Subiekt;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreatePWInInwentaryzacjaWarehouse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:stocktaking';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add PW in Inwentaryzacja Warehouse from other warehouses in Subiekt';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $magIds = [33, 9, 30, 43, 1, 29, 5, 3, 32, 28];

        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = 2;

        foreach ($magIds as $magId) {
            $magNazwa = DB::connection('subiekt')->select('SELECT mag_Nazwa
              FROM sl_Magazyn
              WHERE mag_Id=' . $magId)[0]->mag_Nazwa;


            $towars = $this->getTowars($magId);

            $pw = $subiekt->SuDokumentyManager->DodajPW();

            foreach ($towars as $towar) {
                $pozycja = $pw->Pozycje->Dodaj((int)$towar->tw_id);
                $pozycja->Jm = (string)$towar->tw_JednMiary;
                $pozycja->CenaNettoPrzedRabatem = (float)$towar->cena;
                $pozycja->IloscJm = (int)$towar->ilosc;
            }


            $pw->Uwagi = "Inwentaryzacja z magazynu: " . $magNazwa;
            $pw->Zapisz();
        }


        return self::SUCCESS;

    }


    private function getTowars($magId)
    {
        $towars = DB::connection('subiekt')->select('select
                t.tw_id,
                t.tw_symbol,
                t.tw_nazwa,
                t.tw_JednMiary,
                sum(A.mr_pozostalo) as ilosc,
                W.mw_cena as cena,
                sum(dbo.fnInsMul(A.mr_pozostalo, W.mw_cena, 2)) as wartosc
            from
                dok_magruch A
                inner join tw__towar T on A.mr_TowId = T.tw_Id
                inner join vwDokMagWart W on A.mr_SeriaId = W.mw_SeriaId
            where
                W.mw_pozid in (
                    SELECT
                        TOP 1 T.mw_pozid
                    FROM
                        vwDokMagWart T
                    WHERE
                        T.mw_SeriaId = W.mw_seriaid
                    ORDER BY
                        mw_data DESC,
                        mw_pozid DESC
                )
                and A.mr_pozostalo > 0
                and A.mr_magid in (' . $magId . ')
            group by
                t.tw_id,
                t.tw_symbol,
                t.tw_nazwa,
                t.tw_JednMiary,
                W.mw_cena
                    ORDER BY tw_symbol');

        return $towars;
    }
}
