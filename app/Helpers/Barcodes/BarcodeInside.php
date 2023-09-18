<?php

namespace App\Helpers\Barcodes;

use App\Models\Products\ProductBarcode;
use JetBrains\PhpStorm\NoReturn;

class BarcodeInside implements IBarcode
{

    public static function generate(): ?ProductBarcode
    {
        $barcodes = ProductBarcode::where('type',2)->orderByDesc('barcode')->limit(1)->get();
        if($barcodes->count()===0){
            $barcode = new ProductBarcode(["barcode" => 1000000000009, "type" => 2]);
        }else{
            $barcode = substr($barcodes[0]->barcode, 0, -1);
            $barcode+= 1;
            $barcode = strval($barcode);

            if ($barcode >= 200000000000)
            {
                return null;
            }

            $checksum = self::generateChecksum($barcode);

            $barcode = new ProductBarcode(["barcode" => $barcode . $checksum, "type" => 2]);

        }
        return $barcode;
    }

    private static function generateChecksum($barcode): int
    {
        $suma = 0;
        for ($i = 0; $i < 12; $i++)
        {
            if ($i % 2 == 0)
            {
                $suma += $barcode[$i];
            }
            else
            {
                $suma += 3*$barcode[$i];
            }

        }

        $reszta = 0;
        $reszta = $suma % 10;
        $reszta = 10 - $reszta;
        if ($reszta == 10) $reszta = 0;

        return $reszta;
    }

}
