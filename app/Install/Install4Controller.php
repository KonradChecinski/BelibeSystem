<?php

namespace App\Install;
ini_set('max_execution_time', 600);

use App\Http\Controllers\Controller;
use App\Models\Products\ProductModel;


class Install4Controller extends Controller
{
    public function install()
    {
        foreach (ProductModel::all() as $productModel) {
            $productModel->generateSlug();
            $productModel->save();
        }


        return ("OK");
    }
}
