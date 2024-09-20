<?php

namespace App\Http\Controllers\System;

use App\Helpers\Allegro\Allegro;
use App\Http\Controllers\Controller;
use App\Jobs\Allegro\AllegroCheckMessage;
use App\Jobs\ToSubiekt\ClientOrderCreateInSubiekt;
use App\Jobs\ToSubiekt\TestFZ;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Jobs\ToSubiekt\ZestawienieSprzedazySklepy;
use App\Jobs\Warehouse\CreateWarehouseDocument;
use App\Mail\WarehouseDocumentCreated;
use App\Models\ClientOrder;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Subiekt\Towar;
use App\Models\WarehouseDocument;
use App\Singleton\Subiekt;
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
//        Allegro::getOrders();
//        Allegro::listOrders();
//        \App\Jobs\ToSubiekt\OrderCreateInSubiekt::dispatchSync();
//        $clientOrder = ClientOrder::query()->latest()->first();
//        CreateWarehouseDocument::dispatchSync($clientOrder);
//        $product = Product::find(120);
//        dd($product, $product->available, $product->available_b2c);
//        $warehouseDocument = WarehouseDocument::find(8);
//        ClientOrderCreateInSubiekt::dispatch($warehouseDocument->clientOrder);


        $product = Product::find(95);
        dd($product, $product->available, $product->available_b2c);
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
//        Zapisz kody znikające
//        $product = Product::find(3132); //A-32050
//        $barcodes = [
//            "6942138949667",
//            "5908217626509",
//            "6941607320310"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3067); //A-91038
//        $barcodes = [
//            "6942138917567",
//            "5908217656643",
//            "6941607331958"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3166); //A-91041
//        $barcodes = [
//            "6942138919530",
//            "5908217621429",
//            "6942138976458",
//            "6941607329238"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3188); //A-98001
//        $barcodes = [
//            "6942138919561",
//            "5908217621382",
//            "6941607306260"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3068); //A-98003
//        $barcodes = [
//            "6942138919585",
//            "5908217621368",
//            "6941607306246"
//        ];
//        $this->addBarcodes($product, $barcodes);
////
//        $product = Product::find(3133); //A-36113-1
//        $barcodes = [
//            "5903205314291",
//            "5908220472681",
//            "5908217656612"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3066); //A-36113-2
//        $barcodes = [
//            "5903205314307",
//            "5908220473077",
//            "5908217656629"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3134); //A-36113-3
//        $barcodes = [
//            "5903205314314",
//            "5908220472926",
//            "5908217656636"
//        ];
//        $this->addBarcodes($product, $barcodes);

//        $product = Product::find(3257); //A-1100-1127-M-29
//        $barcodes = [
//            "5904705941093",
//            "5904705940973",
//            "5904705941338"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3261); //A-1100-1127-M-33
//        $barcodes = [
//            "5904705940898",
//            "5904705940652",
//            "5904705940775",
//            "5904705941017",
//            "5904705941130",
//            "5904705941253",
//            "5904705941376"
//        ];
//        $this->addBarcodes($product, $barcodes);
//
//        $product = Product::find(3263); //A-1100-1127-M-35
//        $barcodes = [
//            "5904705941031",
//            "5904705940676",
//            "5904705940799",
//            "5904705940911",
//            "5904705941154",
//            "5904705941277"
//        ];
//        $this->addBarcodes($product, $barcodes);
    }

    private function addBarcodes(Product $product, array $barcodes)
    {
        $barcodesArray = [];

        foreach ($barcodes as $id => $barcodeValue) {
            $barcode = new ProductBarcode(["barcode" => $barcodeValue]);
            $barcode->main = $id == 0;
            $barcode->type = 3;
            array_push($barcodesArray, $barcode);
        }

        $product->barcodes()->delete();
        $product->barcodes()->saveMany($barcodesArray);
        ChangeProductInSubiekt::dispatch($product->id);

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

    public function invoiceStart()
    {
        TestFZ::dispatch();
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
}
