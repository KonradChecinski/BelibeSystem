<?php

namespace App\Helpers\Partners;

use App\Models\Client\Client;
use App\Models\Partner;
use App\Models\PartnerExport;
use Illuminate\Support\Facades\Storage;
use Spatie\ArrayToXml\ArrayToXml;
use Spatie\SimpleExcel\SimpleExcelWriter;

class PartnerExportFile
{
    public static function makeFile(Partner $partner, PartnerExport $partnerExport): bool
    {
        $products = $partner->products;
        $products->each->setAppends(['available']);
        $products->load(["prices"]);

        $client = $partner->client;

        $products = $products->map(function ($product) use ($client) {
            return [
                'symbol' => $product->symbol,
                'availability' => $product->available,
                'wholesale_net_price' => $product->model->priceForClientB2b($client)["discounted_wholesale_net_price"] / 100,
                'retail_gross_price' => $product->prices->retail_gross_price / 100,
            ];
        });


        switch ($partnerExport->type) {
            case 1:
                return self::makeXmlFile($client, $partnerExport, $products);
            case 2:
                return self::makeExcelFile($client, $partnerExport, $products);
            case 3:
                return self::makeCsvFile($client, $partnerExport, $products);
        }

        return false;
    }

    public static function makeXmlFile(Client $client, PartnerExport $partnerExport, $products): bool
    {
        try {
            $xmlConverter = new ArrayToXml([
                "updated_at" => now()->toDateTimeString(),
                "products" => [
                    "product" => $products->toArray()
                ]
            ]);
            $xml = $xmlConverter->prettify()->toXml();

            $partnerExport->update([
                'completed_at' => now(),
            ]);

            Storage::put("partners/{$partnerExport->path}.xml", $xml);


            return true;
        } catch (\Exception $e) {
            return false;
        }
    }


    public static function makeExcelFile(Client $client, PartnerExport $partnerExport, $products): bool
    {
        try {
            $path = storage_path("app/partners/{$partnerExport->path}.xlsx");
            SimpleExcelWriter::create(file: $path, configureWriter: function ($writer) {
                $options = $writer->getOptions();
                $options->setColumnWidth(30, 1);
            })
                ->addHeader(['updated_at', now()->toDateTimeString()])
                ->addHeader(['symbol', 'availability', 'wholesale_net_price', 'retail_gross_price'])
                ->addRows($products->toArray());
            $partnerExport->update([
                'completed_at' => now(),
            ]);


            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function makeCSVFile(Client $client, PartnerExport $partnerExport, $products): bool
    {
        try {


            $path = storage_path("app/partners/{$partnerExport->path}.csv");
            SimpleExcelWriter::create(file: $path)
                ->addHeader(['updated_at', now()->toDateTimeString()])
                ->addHeader(['symbol', 'availability', 'wholesale_net_price', 'retail_gross_price'])
                ->addRows($products->toArray());
            $partnerExport->update([
                'completed_at' => now(),
            ]);


            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
