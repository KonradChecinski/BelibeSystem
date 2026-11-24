<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Facades\Storage;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class ProductImage extends Model
{
    use HasFactory, HasSlug;

    protected static function booted(): void
    {
        static::deleting(function (ProductImage $image) {
            $image->deleteFilesFromDisk();
        });
    }

    /**
     * Normalize stored relative path (converting backslashes to forward slashes).
     */
    public static function normalizeRelativePath(?string $path): ?string
    {
        if ($path === null || trim($path) === '') {
            return null;
        }

        return ltrim(str_replace('\\', '/', trim($path)), '/');
    }

    /**
     * Delete all physical files (basic + generated variants) associated with this image from disk
     * and remove empty parent folders under images/basic.
     */
    public function deleteFilesFromDisk(): void
    {
        $filesMap = [
            'images/basic/' => $this->path_basic,
            'images/thumb/' => $this->path_thumb,
            'images/webp/' => $this->path_webp,
            'images/square/' => $this->path_square,
            'images/2x3/' => $this->path_2x3,
        ];

        $basicDir = null;

        foreach ($filesMap as $prefix => $rawPath) {
            $normalized = self::normalizeRelativePath($rawPath);
            if (!$normalized) {
                continue;
            }

            $fullStoragePath = $prefix . $normalized;
            if ($prefix === 'images/basic/') {
                $basicDir = dirname($fullStoragePath);
            }

            if (Storage::exists($fullStoragePath)) {
                Storage::delete($fullStoragePath);
            }

            // Also check legacy root location 'images/{path_basic}' if it exists outside 'images/basic/'
            if ($prefix === 'images/basic/') {
                $legacyStoragePath = 'images/' . $normalized;
                if (Storage::exists($legacyStoragePath)) {
                    Storage::delete($legacyStoragePath);
                }
            }
        }

        if ($basicDir && $basicDir !== 'images/basic' && $basicDir !== '.') {
            self::cleanEmptyDirectoriesUpwards($basicDir, 'images/basic');
        }
    }

    /**
     * Move the physical basic image file to match the target ProductModelColor and type folder structure:
     * images/basic/{model_symbol}/{color_shortcut}/{type}/{filename}
     *
     * Returns true if the path_basic was updated.
     */
    public function syncPhysicalFileLocation(?ProductModelColor $targetColor = null, ?int $targetType = null): bool
    {
        $color = $targetColor ?? $this->color;
        $type = $targetType ?? $this->type;

        if (!$color) {
            return false;
        }

        $model = $color->relationLoaded('model') ? $color->model : $color->model()->first();
        if (!$model) {
            return false;
        }

        $currentNormalized = self::normalizeRelativePath($this->path_basic);
        if (!$currentNormalized) {
            return false;
        }

        $filename = basename($currentNormalized);
        $expectedRelativeForward = $model->symbol . '/' . $color->shortcut . '/' . $type . '/' . $filename;
        $expectedRelativeDb = str_replace('/', '\\', $expectedRelativeForward);

        if ($currentNormalized === $expectedRelativeForward) {
            if ($this->path_basic !== $expectedRelativeDb) {
                $this->path_basic = $expectedRelativeDb;
                return true;
            }
            return false;
        }

        $oldStoragePath = 'images/basic/' . $currentNormalized;
        $legacyOldStoragePath = 'images/' . $currentNormalized;
        $newStoragePath = 'images/basic/' . $expectedRelativeForward;

        $moved = false;

        if (Storage::exists($oldStoragePath)) {
            if ($oldStoragePath !== $newStoragePath) {
                if (Storage::exists($newStoragePath)) {
                    Storage::delete($oldStoragePath);
                    $moved = true;
                } else {
                    $moved = Storage::move($oldStoragePath, $newStoragePath);
                }
            } else {
                $moved = true;
            }

            if ($moved) {
                self::cleanEmptyDirectoriesUpwards(dirname($oldStoragePath), 'images/basic');
            }
        } elseif (Storage::exists($legacyOldStoragePath)) {
            if (Storage::exists($newStoragePath)) {
                Storage::delete($legacyOldStoragePath);
                $moved = true;
            } else {
                $moved = Storage::move($legacyOldStoragePath, $newStoragePath);
            }

            if ($moved) {
                self::cleanEmptyDirectoriesUpwards(dirname($legacyOldStoragePath), 'images');
            }
        } elseif (Storage::exists($newStoragePath)) {
            // File is already at the target path on disk
            $moved = true;
        }

        if ($moved) {
            $this->path_basic = $expectedRelativeDb;
            return true;
        }

        return false;
    }

    /**
     * Remove empty directories upwards until reaching $stopAtDir.
     */
    public static function cleanEmptyDirectoriesUpwards(string $dir, string $stopAtDir = 'images/basic'): void
    {
        $dir = trim(str_replace('\\', '/', $dir), '/');
        $stopAtDir = trim(str_replace('\\', '/', $stopAtDir), '/');

        while ($dir !== '' && $dir !== '.' && $dir !== $stopAtDir && str_starts_with($dir, $stopAtDir . '/')) {
            if (!Storage::exists($dir)) {
                $dir = dirname($dir);
                continue;
            }

            $files = Storage::files($dir);
            $directories = Storage::directories($dir);

            if (empty($files) && empty($directories)) {
                Storage::deleteDirectory($dir);
                $dir = trim(str_replace('\\', '/', dirname($dir)), '/');
            } else {
                break;
            }
        }
    }


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'product_model_color_id',
        'order',
        'path_basic',
        'path_square',
        'path_webp',
        'path_thumb',
        'path_2x3',
        'tiktok_uri',
        'width',
        'height',
        'type',
        'publish',
        'main'
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function () {
                return $this->model->symbol . "-" . uniqid('', true);
            })
            ->saveSlugsTo('slug')
//            ->skipGenerateWhen(fn() => $this->slug !== '')
            ->preventOverwrite();
    }


    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, "product_model_color_id", "id");
    }

    public function model(): HasOneThrough
    {
        return $this->hasOneThrough(ProductModel::class, ProductModelColor::class, "id", "id", "product_model_color_id", "product_model_id");
    }
}
