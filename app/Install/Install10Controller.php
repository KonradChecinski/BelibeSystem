<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\ProductEmpikCategory;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\ProductImage;


class Install10Controller extends Controller
{
    public function install()
    {

        foreach (ProductImage::all() as $productImage) {
            $productImage->generateSlug();

            $productImage->save();
        }

        return ("OK");
    }
}
