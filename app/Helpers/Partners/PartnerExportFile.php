<?php

namespace App\Helpers\Partners;

use App\Models\Partner;
use App\Models\PartnerExport;
use Illuminate\Support\Facades\Storage;
use Spatie\ArrayToXml\ArrayToXml;
use Spatie\SimpleExcel\SimpleExcelWriter;

class PartnerExportFile
{
    public static function makeFile(Partner $partner, PartnerExport $partnerExport): bool
    {
        switch ($partnerExport->type) {
            case 1:
                return self::makeXmlFile($partnerExport, $partner->products);
            case 2:
                return self::makeExcelFile($partnerExport, $partner->products);
        }

        return false;
    }

    public static function makeXmlFile($partnerExport, $products): bool
    {
        try {
            $products = $products->map(function ($product) {
                return [
                    'symbol' => $product->symbol,
                    'availability' => $product->available,
                ];
            });
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


    public static function makeExcelFile($partnerExport, $products): bool
    {
        try {
            $products = $products->map(function ($product) {
                return [
                    'symbol' => $product->symbol,
                    'availability' => $product->available,
                ];
            });

            $path = storage_path("app/partners/{$partnerExport->path}.xlsx");
            SimpleExcelWriter::create(file: $path, configureWriter: function ($writer) {
                $options = $writer->getOptions();
                $options->setColumnWidth(30, 1);
            })
                ->addHeader(['updated_at', now()->toDateTimeString()])
                ->addHeader(['symbol', 'availability'])
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
