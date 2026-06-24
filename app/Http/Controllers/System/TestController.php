<?php

namespace App\Http\Controllers\System;

use App\Helpers\Allegro\Allegro;
use App\Helpers\Partners\PartnerExportFile;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PartnerExportController;
use App\Http\Controllers\WarehouseLocationController;
use App\Http\Controllers\WarehouseProductModelController;
use App\Jobs\FromSubiekt\Finanse\CreateSettlementsFromSubiekt;
use App\Jobs\FromSubiekt\Finanse\DeleteSettlementsFromSubiekt;
use App\Jobs\FromSubiekt\Finanse\UpdateSettlementsFromSubiekt;
use App\Mail\WarehouseDocumentCreated;
use App\Models\Client\Client;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Models\Products\Product;
use App\Models\Subiekt\Towar;
use App\Models\WarehouseDocument;
use App\Singleton\Subiekt;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Spatie\SimpleExcel\SimpleExcelReader;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        dd(Allegro::searchOffer(Product::find(135))->json());
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public static function invoice()
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $path = storage_path("app/test/2.csv");
        $rows = SimpleExcelReader::create($path)
            ->useHeaders(["lp", "symbol", "stan", "cena_magazynowa", "wartosc_netto", "wartosc_brutto"])
            ->useDelimiter(";")
            ->getRows();

        $fz = $subiekt->SuDokumentyManager->DodajFZ();
        $fz->KontrahentId = 128;
        $fz->NumerOryginalny = "???";
        $fz->LiczonyOdCenBrutto = false;
        $fz->PoziomCenyId = 2;
        $fz->Pozycje->PrzeliczWedlugPoziomuCen();


        $rows->each(function ($row) use ($fz) {
//            dd($row);
            $towarId = Towar::query()->where("tw_Symbol", $row["symbol"])->first()->tw_Id;
            $cena = (float)str_replace(',', '.', str_replace('.', '', $row["cena_magazynowa"]));


            $pozycja = $fz->Pozycje->Dodaj($towarId);
            $pozycja->CenaNettoPrzedRabatem = $cena;
            $pozycja->IloscJm = (int)$row["stan"];
        });

        $fz->Zapisz();
    }


//    public static function bikinarium()
//    {
//        $partner = Partner::find(1);
//        $client = Client::find(329);
//        $payment = B2bPayment::find(3);
//        $mag_id = 46;
//
//
////        $subiekt = app(Subiekt::class)->getInstance();
////        $subiekt = $subiekt->connect();
//
//        $path = storage_path("app/test/bikinarium.csv");
//        $csv = SimpleExcelReader::create($path)
//            ->useHeaders(["Symbol", "Sprzedaz", "Zwroty", "Bilans", "Cena", "Cena_brutto", "Wartosc_netto", "Wartosc_brutto"])
//            ->useDelimiter(";");
//
//        $rowsJson = json_encode($csv->getRows());
//        $rows = collect(json_decode($rowsJson, true));
//        $rows = $rows->map(function ($row) {
//            $row['Cena'] = (float)str_replace(',', '.', $row['Cena']);
//            $row['Cena_brutto'] = (float)str_replace(',', '.', $row['Cena_brutto']);
//            $row['Wartosc_netto'] = (float)str_replace(',', '.', $row['Wartosc_netto']);
//            $row['Wartosc_brutto'] = (float)str_replace(',', '.', $row['Wartosc_brutto']);
//            return $row;
//        });
//
//
//        $sold = $rows->where("Bilans", ">", 0);
//        $returned = $rows->where("Bilans", "<", 0);
//
//        CreateInvoiceFromPartnerSettlement::dispatch($partner, $client, $sold, $payment, $mag_id);
//        CreateInvoiceCorrectionsFromPartnerSettlement::dispatch($partner, $client, $returned, $payment, $mag_id);
////        CreateInvoiceCorrectionsFromPartnerSummaryFile::dispatchSync($partner, $client, $returned, $payment, $mag_id);
////        dd($sold->toArray(), $returned->toArray(), $rows->toArray());
//    }
}
