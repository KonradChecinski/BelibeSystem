<?php

namespace App\Http\Controllers;

use App\Models\Products\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class StorageController extends Controller
{
    public function storage(string $path)
    {
        return Storage::get('public/' . str_replace('>', '/', $path));
    }

    public function images(string $slug)
    {
        if ($slug === "brak.jpg") {
            $img = Storage::get('images/basic/brak.jpg');
            return response($img)->header('Content-Type', 'image/jpg');
        }

        $image = ProductImage::findBySlug($slug);
        $path = $image->path_basic;

        $img = Storage::get('images/basic/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('images/basic/' . str_replace('\\', '/', $path));
        return response($img)->header('Content-Type', $mimeType);
    }

    public function imagesThumb(string $slug)
    {
        $productImage = ProductImage::findBySlug($slug);
        $path = $productImage->path_thumb;

        if ($path) {
            $img = Storage::get('images/thumb/' . str_replace('\\', '/', $path));
            $mimeType = Storage::mimeType('images/thumb/' . str_replace('\\', '/', $path));
        } else {
            $imgBasic = Storage::get('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $mimeType = Storage::mimeType('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $extension = File::extension('images/basic/' . str_replace('\\', '/', $productImage->path_basic));


            $img = Image::make($imgBasic)
                ->resize(null, 450, function ($constraint) {
                    $constraint->aspectRatio();
                })
                ->encode($mimeType, 90);

            // Generowanie ścieżki z UUID
            $thumbPath = (string)Str::uuid() . "." . $extension;

            // Opcjonalnie, jeśli naprawdę chcesz sprawdzać istnienie, co jest rzadko potrzebne:
            while (Storage::exists('images/thumb/' . $thumbPath)) {
                $thumbPath = (string)Str::uuid() . "." . $extension;
            }

            Storage::put('images/thumb/' . $thumbPath, $img);

            $productImage->path_thumb = $thumbPath;
            $productImage->save();
        }


        return response($img)->header('Content-Type', $mimeType);
    }

    public function imagesWebp(string $slug)
    {
        if ($slug === "brak.jpg") {
            $img = Storage::get('images/webp/brak.webp');
            return response($img)->header('Content-Type', 'image/webp');
        }


        $productImage = ProductImage::findBySlug($slug);
        $path = $productImage->path_webp;

        if ($path) {
            $img = Storage::get('images/webp/' . str_replace('\\', '/', $path));
        } else {
            $imgBasic = Storage::get('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $img = Image::make($imgBasic)->encode('webp', 90);

            // Generowanie ścieżki z UUID
            $webpPath = (string)Str::uuid() . ".webp";

            // Opcjonalnie, jeśli naprawdę chcesz sprawdzać istnienie, co jest rzadko potrzebne:
            while (Storage::exists('images/webp/' . $webpPath)) {
                $webpPath = (string)Str::uuid() . ".webp";
            }

            Storage::put('images/webp/' . $webpPath, $img);

            $productImage->path_webp = $webpPath;
            $productImage->save();
        }


        return response($img)->header('Content-Type', 'image/webp');
    }

    public function imagesSquare(string $slug)
    {
        $productImage = ProductImage::findBySlug($slug);
        $path = $productImage->path_square;

        if ($path) {
            $img = Storage::get('images/square/' . str_replace('\\', '/', $path));
            $mimeType = Storage::mimeType('images/square/' . str_replace('\\', '/', $path));
        } else {
            $imgBasic = Storage::get('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $mimeType = Storage::mimeType('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $extension = File::extension('images/basic/' . str_replace('\\', '/', $productImage->path_basic));

            $tempImg = Image::make($imgBasic);
            $size = max($tempImg->width(), $tempImg->height());

            $img = Image::canvas($size, $size, '#ffffff')->insert($imgBasic, 'center')->encode($mimeType, 100);

            // Generowanie ścieżki z UUID
            $squarePath = (string)Str::uuid() . "." . $extension;

            // Opcjonalnie, jeśli naprawdę chcesz sprawdzać istnienie, co jest rzadko potrzebne:
            while (Storage::exists('images/square/' . $squarePath)) {
                $squarePath = (string)Str::uuid() . "." . $extension;
            }

            Storage::put('images/square/' . $squarePath, $img);

            $productImage->path_square = $squarePath;
            $productImage->save();
        }

        return response($img)->header('Content-Type', $mimeType);
    }

    public function images2x3(string $slug)
    {
        $productImage = ProductImage::findBySlug($slug);
        $path = $productImage->path_2x3;

        if ($path) {
            $img = Storage::get('images/2x3/' . str_replace('\\', '/', $path));
            $mimeType = Storage::mimeType('images/2x3/' . str_replace('\\', '/', $path));
        } else {
            $imgBasic = Storage::get('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $mimeType = Storage::mimeType('images/basic/' . str_replace('\\', '/', $productImage->path_basic));
            $extension = File::extension('images/basic/' . str_replace('\\', '/', $productImage->path_basic));

            $tempImg = Image::make($imgBasic);

            // Maksymalne wymiary kanwy
            $maxWidth = 1280;
            $maxHeight = 1920;

            // Rozmiary obrazu wejściowego
            $originalWidth = $tempImg->width();
            $originalHeight = $tempImg->height();

            // Obliczamy proporcje obrazu wejściowego
            $originalRatio = $originalWidth / $originalHeight;
            $targetRatio = 2 / 3; // Docelowe proporcje kanwy

            // Oblicz dynamiczny rozmiar kanwy w zależności od wymiarów wejściowego obrazu
            if ($originalRatio > $targetRatio) {
                // Obraz jest szerszy niż proporcja 2x3 -> dopasowanie do szerokości
                $canvasWidth = min($originalWidth, $maxWidth);
                $canvasHeight = intval($canvasWidth / $targetRatio);
            } else {
                // Obraz jest węższy niż proporcja 2x3 -> dopasowanie do wysokości
                $canvasHeight = min($originalHeight, $maxHeight);
                $canvasWidth = intval($canvasHeight * $targetRatio);
            }

            // Tworzymy kanwę o obliczonych wymiarach i proporcjach 2x3
            $canvas = Image::canvas($canvasWidth, $canvasHeight, '#ffffff');

            // Skalujemy obraz wejściowy, aby dopasować go do kanwy, bez zmiany proporcji
            $tempImg->resize(
                $canvasWidth,
                $canvasHeight,
                function ($constraint) {
                    $constraint->aspectRatio(); // Zachowaj proporcje
                    $constraint->upsize(); // Nie powiększaj mniejszych obrazów
                }
            );

            // Wstawiamy obraz na środek kanwy
            $canvas->insert($tempImg, 'center');

            // Generujemy unikalną nazwę pliku
            $path2x3 = (string)Str::uuid() . "." . $extension;

            // Sprawdzamy unikalność nazwy pliku
            while (Storage::exists('images/2x3/' . $path2x3)) {
                $path2x3 = (string)Str::uuid() . "." . $extension;
            }

            $img = $canvas->encode($mimeType, 100);

            // Zapisujemy obraz na serwerze
            Storage::put('images/2x3/' . $path2x3, $img);

            // Aktualizujemy ścieżkę w tabeli ProductImage
            $productImage->path_2x3 = $path2x3;
            $productImage->save();
        }

        return response($img)->header('Content-Type', $mimeType);
    }

    public function colorIcons(string $path)
    {
        $img = Storage::get('colors/' . str_replace('\\', '/', $path));
        $mimeType = Storage::mimeType('colors/' . str_replace('\\', '/', $path));
        return response($img)->header('Content-Type', $mimeType);
    }
}
