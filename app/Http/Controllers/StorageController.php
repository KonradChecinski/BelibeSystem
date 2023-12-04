<?php

namespace App\Http\Controllers;

use App\Models\Products\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class StorageController extends Controller
{
    public function storage(string $path)
    {
        return Storage::get('public/' . str_replace('>', '/', $path));
    }

    public function images(string $path)
    {
        //    header("Content-Type: image/jpeg");
        return Storage::get('images/' . str_replace('\\', '/', $path));
    }

    public function imagesSquare(string $path)
    {
        $image = ProductImage::query()->where('path', $path)->firstOrFail();
        $path = $image->path;
        $img = Storage::get('images/' . str_replace('\\', '/', $path));

        $size = max($image->width, $image->height);
        $img = Image::canvas($size, $size, '#ffffff')->insert($img, 'center');

//    header("Content-Type: image/jpeg");
        return $img->response('jpg', 100);
    }

}
