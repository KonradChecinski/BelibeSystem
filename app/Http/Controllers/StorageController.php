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
        $img = Storage::get('images/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('images/' . str_replace('\\', '/', $path));
        return response($img)->header('Content-Type', $mimeType);
    }

    public function imagesThumb(string $path)
    {
//        $image = ProductImage::query()->where('path', $path)->firstOrFail();
//        $path = $image->path;
        $img = Storage::get('images/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('images/' . str_replace('\\', '/', $path));


        $img = Image::make($img)
            ->resize(null, 450, function ($constraint) {
                $constraint->aspectRatio();
            })
            ->encode($mimeType, 90);
        return response($img)->header('Content-Type', $mimeType);
    }

    public function imagesWebp(string $path)
    {
//        $image = ProductImage::query()->where('path', $path)->firstOrFail();
//        $path = $image->path;
        $img = Storage::get('images/' . str_replace('\\', '/', $path));

        $img = Image::make($img)->encode('webp', 90);

        return response($img)->header('Content-Type', 'image/webp');
    }

    public function imagesSquare(string $path)
    {
        $img = Storage::get('images/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('images/' . str_replace('\\', '/', $path));
        $tempImg = Image::make($img);

        $size = max($tempImg->width(), $tempImg->height());

        $img = Image::canvas($size, $size, '#ffffff')->insert($img, 'center')->encode($mimeType, 100);
        return response($img)->header('Content-Type', $mimeType);
    }

    public function colorIcons(string $path)
    {
        $img = Storage::get('colors/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('colors/' . str_replace('\\', '/', $path));
        return response($img)->header('Content-Type', $mimeType);
    }
}
