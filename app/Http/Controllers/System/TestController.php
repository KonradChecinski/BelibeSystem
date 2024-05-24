<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Jobs\Shoper\OrderCreateInSubiekt;
use App\Jobs\ToSubiekt\Towar\ChangeProductInSubiekt;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $image = ProductImage::find(130);
        dd(route("images", ['path' => $image->path]));
//        ShoperOrderCreateInSubiekt::dispatchSync();
//        $client = Client::find(1);
//        $model = ProductModel::find(37);
////        $price = PriceForClient::getPrice($model, $client);
//        $price = $model->priceForClientB2b($client);
//        dd($price);

        //        foreach (ProductModelColor::query()->whereNull("b2c_color_id")->get() as $productModelColor) {
//            $b2cColor = B2cColor::query()->where("name", $productModelColor->b2c_name)->first();
//            if (is_null($b2cColor)) continue;
//
//            $productModelColor->b2cColor()->associate($b2cColor);
//            $productModelColor->save();
////            dd($productModelColor, $b2cColor);
//        }

//        $client = new Client([
//            "name" => "Belibe2",
//            "nip" => "6252455823",
////            "country_id" => 1,
//            "city" => "Będzin",
//            'street' => "Siemońska",
//            'building_number' => 4,
//            'postal_code' => "42-500",
//            'phone' => "510750316",
//            'email' => "test@test.pl",
////            'status_id' => 2,
//            'priority' => 3,
////            'source_of_acquisition_id' => 1,
////            'user_id' => 2,
////            'payment_id' => 1,
////            'industry_id' => 1,
//            'blacklist' => 0,
//        ]);
//        $client->country()->associate(1);
//        $client->status()->associate(2);
//        $client->sourceOfAcquisition()->associate(1);
//        $client->payment()->associate(1);
//        $client->industry()->associate(1);
//
//        $client->accountManager()->associate(2);

//        $client = Client::find(1);
//
//        $clientRecipient = new ClientRecipient([
////            "client_id" => $client->id,
////            "country_id" => 1,
//            "subiekt_id" => null,
//            'name' => "test",
//            'city' => "Będzin",
//            'street' => "Siemońska",
//            'building_number' => "4B",
//            'apartment_number' => 1,
//            'postal_code' => "42-500",
//        ]);
//        $clientRecipient->country()->associate(1);
//        $client->recipient()->save($clientRecipient);
////        $clientRecipient->save();
//
//        dd($client->recipient(), $client->recipient);


//        $client->save();

//        $clientInvoice = new ClientInvoice([
//            'type' => 1,
//            'number' => "FV 153/MAG/01/2024",
//            'net_value' => 20000,
//            'gross_value' => 24600,
//            'datetime' => '2024-02-21 16:00',
//            'path' => "",
//        ]);
//        $clientInvoice->client()->associate(1);
//        $clientInvoice->save();

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
}
