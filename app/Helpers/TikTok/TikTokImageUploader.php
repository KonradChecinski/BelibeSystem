<?php

namespace App\Helpers\TikTok;

use App\Models\Products\ProductImage;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Laraditz\TikTok\Exceptions\TikTokAPIError;
use Laraditz\TikTok\Models\TiktokRequest;
use Laraditz\TikTok\Models\TiktokShop;
use Laraditz\TikTok\TikTok as LaraditzTikTok;
use RuntimeException;

class TikTokImageUploader
{
    public const UPLOAD_ROUTE = '/product/202309/images/upload';

    /**
     * Ensure 1x1 square image is uploaded to TikTok Shop and return its URI.
     */
    public function getOrUploadMainImageUri(ProductImage $productImage, ?string $shopId = null): string
    {
        if (!empty($productImage->tiktok_uri)) {
            return $productImage->tiktok_uri;
        }

        [$binary, $filename] = $this->resolveSquareImageBinary($productImage);

        $uri = $this->uploadBinaryToTikTok($binary, $filename, 'MAIN_IMAGE', $shopId);

        $productImage->tiktok_uri = $uri;
        $productImage->save();

        return $uri;
    }

    /**
     * Get or generate the 1x1 square image binary (matching StorageController::imagesSquare).
     *
     * @return array{0: string, 1: string} [binaryContent, filename]
     */
    public function resolveSquareImageBinary(ProductImage $productImage): array
    {
        $squarePath = $productImage->path_square
            ? 'images/square/' . str_replace('\\', '/', $productImage->path_square)
            : null;

        if ($squarePath && Storage::exists($squarePath)) {
            $binary = Storage::get($squarePath);
            $filename = basename($squarePath);

            return [$binary, $filename];
        }

        $basicPath = 'images/basic/' . str_replace('\\', '/', (string) $productImage->path_basic);
        if (!$productImage->path_basic || !Storage::exists($basicPath)) {
            throw new RuntimeException("Brak pliku zdjęcia bazowego dla ProductImage ID {$productImage->id} ({$basicPath}).");
        }

        $imgBasic = Storage::get($basicPath);
        $mimeType = Storage::mimeType($basicPath) ?: 'image/jpeg';
        $extension = File::extension($basicPath) ?: 'jpg';

        $tempImg = Image::make($imgBasic);
        $size = max($tempImg->width(), $tempImg->height(), 600);

        $encoded = (string) Image::canvas($size, $size, '#ffffff')
            ->insert($imgBasic, 'center')
            ->encode($mimeType, 100);

        $generatedFilename = (string) Str::uuid() . '.' . $extension;
        while (Storage::exists('images/square/' . $generatedFilename)) {
            $generatedFilename = (string) Str::uuid() . '.' . $extension;
        }

        Storage::put('images/square/' . $generatedFilename, $encoded);

        $productImage->path_square = $generatedFilename;
        $productImage->save();

        return [$encoded, $generatedFilename];
    }

    /**
     * Upload binary image to TikTok Shop API (/product/202309/images/upload) using multipart/form-data.
     * Note: For multipart/form-data requests in TikTok Open API, the HMAC signature excludes the request body.
     */
    public function uploadBinaryToTikTok(
        string $binary,
        string $filename,
        string $useCase = 'MAIN_IMAGE',
        ?string $shopId = null
    ): string {
        /** @var LaraditzTikTok $tiktok */
        $tiktok = app('tiktok');
        if ($shopId) {
            $tiktok->setShopId($shopId);
        }

        $tiktok->checkShop();
        if (!$tiktok->getShop()) {
            $fallbackShop = TiktokShop::query()->first();
            if ($fallbackShop) {
                $tiktok->setShop($fallbackShop);
                $tiktok->setShopId($fallbackShop->id);
                if ($fallbackShop->accessToken?->access_token) {
                    $tiktok->setAccessToken($fallbackShop->accessToken->access_token);
                }
            }
        }

        $accessToken = $tiktok->getAccessToken();
        if (!$accessToken) {
            throw new TikTokAPIError([
                'code' => 'missing_access_token',
                'message' => 'Brak aktywnego tokenu dostępowego TikTok Shop.',
            ]);
        }

        $queryString = [
            'app_key' => $tiktok->getAppKey(),
            'timestamp' => now()->getTimestamp(),
        ];

        // Multipart upload signature does NOT include payload body (calculated identically to GET)
        $signature = $tiktok->getSignature(
            route: self::UPLOAD_ROUTE,
            method: 'GET',
            queryString: $queryString,
            payload: []
        );

        $queryString['sign'] = $signature;
        $url = rtrim((string) config('tiktok.base_url', 'https://open-api.tiktokglobalshop.com'), '/')
            . self::UPLOAD_ROUTE
            . '?' . http_build_query($queryString);

        $logRequest = new TiktokRequest([
            'shop_id' => $tiktok->getShopId(),
            'action' => 'ProductService::uploadImage',
            'url' => $url,
            'request' => [
                'filename' => $filename,
                'use_case' => $useCase,
            ],
        ]);

        if (config('tiktok.logging.requests', true)) {
            $logRequest->save();
        }

        $response = Http::withHeaders([
            'x-tts-access-token' => $accessToken,
        ])
            ->asMultipart()
            ->attach('data', $binary, $filename)
            ->post($url, [
                'use_case' => $useCase,
            ]);

        $response->throw(function (Response $response, RequestException $e) use ($logRequest) {
            $result = $response->json();
            if (config('tiktok.logging.requests', true)) {
                $logRequest->update([
                    'code' => data_get($result, 'code'),
                    'message' => Str::limit((string) data_get($result, 'message'), 255),
                    'error' => Str::limit($e->getMessage(), 255),
                ]);
            }
        });

        $result = $response->json() ?? [];
        $code = data_get($result, 'code');
        $message = data_get($result, 'message');

        if (config('tiktok.logging.requests', true)) {
            $logRequest->update([
                'code' => $code,
                'message' => $message ? Str::limit((string) $message, 255) : null,
                'response' => $result,
                'request_id' => data_get($result, 'request_id'),
                'error' => $code != '0' ? Str::limit((string) ($message ?? $code), 255) : null,
            ]);
        }

        if ($code != '0') {
            throw new TikTokAPIError($result ?: [
                'code' => 'image_upload_failed',
                'message' => 'Błąd przesyłania zdjęcia do TikTok Shop.',
            ]);
        }

        $uri = (string) data_get($result, 'data.uri', '');
        if ($uri === '') {
            throw new TikTokAPIError([
                'code' => 'missing_image_uri',
                'message' => 'TikTok Shop nie zwrócił identyfikatora URI przesłanego zdjęcia.',
            ]);
        }

        return $uri;
    }
}

