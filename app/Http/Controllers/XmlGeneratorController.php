<?php

namespace App\Http\Controllers;
ini_set('max_execution_time', 120);

use App\Helpers\SimpleXML\SimpleXMLExtended;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use DOMDocument;
use Flowgistics\XML\XMLBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SimpleXMLElement;

class XmlGeneratorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function merkandiGenerateProductsXML()
    {
//        $productModels = ProductModel::all();
        $productModels = ProductModel::query()->limit(100)->offset(36)->get();

        $xml = new SimpleXMLExtended('<products/>');

        foreach ($productModels as $model) {


            foreach ($model->products as $product) {
//                dd($model, $product);
                $productRow = $xml->addChild('product');

                $productRow->addChild('sku', $product->symbol);
                $productRow->addChild('name')->addCData($product->name); //cdata
                $productRow->addChild('description')->addCData($model->description_b2b); //cdata

                $barcode = $product->barcodes()->where("main", 1)->where("type", 1)->first();
                if (!is_null($barcode)) $productRow->addChild('ean', $barcode->barcode); //	Kod EAN towaru.


                $productRow->addChild('currency', 'PLN'); //Waluta. Kod waluty zgodny z ISO 4217.
                $productRow->addChild('price', $model->prices->wholesale_net_price / 100); //Cena produktu. Wartość numeryczna, bez wartości tysięcznych. Używaj kropki, aby oddzielić wartości dziesiętne od całych. W przypadku braku ceny, system ustawi cenę "do uzgodnienia".
                $productRow->addChild('price_retail', $model->prices->retail_gross_price / 100); //Standardowa cena sprzedaży produktu dla końcowych klientów detalicznych, stanowiąca podstawę dla strategii wyceny i zarządzania marżami. Reprezentuje ona kwotę, którą klienci są oczekiwani zapłacić podczas zakupu produktu od sprzedawcy detalicznego.


                $productRow->addChild('category_id', ''); //id merkandi
                $productRow->addChild('country_id', ''); //id merkandi
                $productRow->addChild('ware_id', ''); //id merkandi
                $productRow->addChild('unit_id', ''); //id merkandi


                $productRow->addChild('shipping_days', 4); //Czas dostawy w dniach. Wprowadź tylko cyfry.

                $productRow->addChild('qty_on_request', 2); //1 - bez ograniczeń, 2 - wskazana ilość, wymagane jest wypełnienie pola <qty>
                $productRow->addChild('qty', $product->quantity); //Wymagane gdy <qty_on_request> jest ustawione na 2. Ilość dostępnego towaru.
                $productRow->addChild('min_order_type', 'price'); //Typ minimalnego zamówienia zamówienie. qty - ilościowe, price - kwotowe
                $productRow->addChild('min_order', '1000'); //Minimalne zamówienie. Ilość towaru niezbędna do złożenia zamówienia. Jeżeli pole pozostanie puste, to domyślnie na stronie oferty wyświetlona zostanie informacja „na zapytanie".


                $productRow->addChild('for_negotiation', 1); //	Wartość 1, jeżeli jesteś skłonny do negocjacji ceny. Oferty z tą opcją generują więcej zapytań ze względu na otwartość na negocjacje, która jest pożądana przez hurtowników.
                $productRow->addChild('locale', 'pl');

                $photosRow = $productRow->addChild('photos');
                foreach ($product->images->sortBy("order")->values() as $image) {
                    $photosRow->addChild('photoUrl', route("images1x1", ['path' => $image->path]));
                }

            }


        }

        $dom = new DOMDocument('1.0');
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->loadXML($xml->asXML());

        return response($dom->saveXML(), 200)
            ->header("Content-type", "text/xml")
            ->header("Cache-Control", "no-cache, must-revalidate")
            ->header("Pragma", "no-cache");
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
        //
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
