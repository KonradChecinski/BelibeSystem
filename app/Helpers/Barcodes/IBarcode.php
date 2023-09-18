<?php

namespace App\Helpers\Barcodes;

use App\Models\Products\ProductBarcode;

interface IBarcode
{
    public static function generate(): ?ProductBarcode;
}
