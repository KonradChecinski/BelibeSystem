<?php

namespace App\Console\Commands;

use App\Models\Products\ProductImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanProductImagesStorageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clean
                            {--dry-run : Tylko pokaż co zostałoby przeniesione lub usunięte, bez modyfikacji plików i bazy}
                            {--delete-missing-db : Usuń z bazy danych rekordy ProductImage, których plik bazowy nie istnieje na dysku}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Porządkuje folder storage/app/images: przenosi zdjęcia do właściwych folderów kolorów/modeli oraz usuwa nieaktualne (osierocone) pliki i puste katalogi.';

    /**
     * Protected fallback files that must never be deleted.
     *
     * @var array<int, string>
     */
    protected array $protectedFiles = [
        'images/brak.jpg',
        'images/basic/brak.jpg',
        'images/webp/brak.webp',
        'images/.gitignore',
        'images/basic/.gitignore',
        'images/thumb/.gitignore',
        'images/webp/.gitignore',
        'images/square/.gitignore',
        'images/2x3/.gitignore',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $deleteMissingDb = (bool) $this->option('delete-missing-db');

        if ($dryRun) {
            $this->warn('=== TRYB TESTOWY (--dry-run) - żadne pliki ani rekordy nie zostaną zmienione ===');
        }

        $this->info('1. Wczytywanie zdjęć z bazy danych i weryfikacja ścieżek folderów (model / kolor / typ)...');

        $images = ProductImage::with(['color.model'])->get();

        $relocatedCount = 0;
        $fixedDbPathsCount = 0;
        $missingOnDiskCount = 0;
        $deletedDbRecordsCount = 0;
        $clearedMissingVariantCount = 0;

        /** @var array<string, bool> $validStoragePaths */
        $validStoragePaths = [];
        foreach ($this->protectedFiles as $protected) {
            $validStoragePaths[strtolower($protected)] = true;
        }

        foreach ($images as $image) {
            $color = $image->color;
            $model = $color?->model;

            $currentBasicNorm = ProductImage::normalizeRelativePath($image->path_basic);

            if (!$currentBasicNorm) {
                $missingOnDiskCount++;
                $this->warn(" - [Brak ścieżki] ProductImage ID {$image->id} ma pustą kolumnę path_basic.");
                if ($deleteMissingDb && !$dryRun) {
                    $image->delete();
                    $deletedDbRecordsCount++;
                }
                continue;
            }

            $currentStoragePath = 'images/basic/' . $currentBasicNorm;
            $legacyStoragePath = 'images/' . $currentBasicNorm;

            $expectedStoragePath = $currentStoragePath;
            $expectedRelativeForward = $currentBasicNorm;
            $expectedRelativeDb = str_replace('/', '\\', $currentBasicNorm);

            if ($color && $model) {
                $filename = basename($currentBasicNorm);
                $expectedRelativeForward = $model->symbol . '/' . $color->shortcut . '/' . $image->type . '/' . $filename;
                $expectedRelativeDb = str_replace('/', '\\', $expectedRelativeForward);
                $expectedStoragePath = 'images/basic/' . $expectedRelativeForward;
            }

            $existsAtCurrent = Storage::exists($currentStoragePath);
            $existsAtLegacy = !$existsAtCurrent && Storage::exists($legacyStoragePath);
            $existsAtExpected = ($expectedStoragePath !== $currentStoragePath) && Storage::exists($expectedStoragePath);

            if (!$existsAtCurrent && !$existsAtLegacy && !$existsAtExpected) {
                $missingOnDiskCount++;
                $this->warn(" - [Brak pliku na dysku] ProductImage ID {$image->id}: {$currentStoragePath}");
                if ($deleteMissingDb) {
                    if (!$dryRun) {
                        $image->delete();
                    }
                    $deletedDbRecordsCount++;
                }
                continue;
            }

            // Check if file actually needs physical relocation to match current model / color / type
            if ($currentBasicNorm !== $expectedRelativeForward || (!$existsAtCurrent && $existsAtLegacy)) {
                $sourcePath = $existsAtCurrent ? $currentStoragePath : ($existsAtLegacy ? $legacyStoragePath : $expectedStoragePath);
                $this->line(" - [Przenoszenie] ID {$image->id}: {$sourcePath} -> {$expectedStoragePath}");

                if (!$dryRun) {
                    if ($image->syncPhysicalFileLocation($color, (int) $image->type)) {
                        $image->saveQuietly();
                    }
                }
                $relocatedCount++;
                $validStoragePaths[strtolower($expectedStoragePath)] = true;
            } else {
                // File is already in the right directory, but DB path_basic might have double backslashes (e.g. \\6a69...)
                if ($image->path_basic !== $expectedRelativeDb) {
                    if (!$dryRun) {
                        $image->path_basic = $expectedRelativeDb;
                        $image->saveQuietly();
                    }
                    $fixedDbPathsCount++;
                }
                $validStoragePaths[strtolower($currentStoragePath)] = true;
            }

            // Verify generated variants (thumb, webp, square, 2x3)
            $variants = [
                'path_thumb' => 'images/thumb/',
                'path_webp' => 'images/webp/',
                'path_square' => 'images/square/',
                'path_2x3' => 'images/2x3/',
            ];

            $variantDirty = false;
            foreach ($variants as $column => $prefix) {
                $valNorm = ProductImage::normalizeRelativePath($image->{$column});
                if (!$valNorm) {
                    continue;
                }

                $variantStoragePath = $prefix . $valNorm;
                if (Storage::exists($variantStoragePath)) {
                    $validStoragePaths[strtolower($variantStoragePath)] = true;
                } else {
                    // Variant file doesn't exist on disk; reset column to null so StorageController can regenerate it on demand
                    if (!$dryRun) {
                        $image->{$column} = null;
                        $variantDirty = true;
                    }
                    $clearedMissingVariantCount++;
                }
            }

            if ($variantDirty && !$dryRun) {
                $image->saveQuietly();
            }
        }

        $this->info('2. Skanowanie plików w storage/app/images...');

        $allFilesOnDisk = Storage::allFiles('images');
        $deletedOrphanFilesCount = 0;
        $freedBytes = 0;

        foreach ($allFilesOnDisk as $diskFile) {
            $normalizedDiskFile = ltrim(str_replace('\\', '/', $diskFile), '/');
            $lookupKey = strtolower($normalizedDiskFile);

            if (isset($validStoragePaths[$lookupKey])) {
                continue;
            }

            // Skip hidden files like .gitignore
            if (str_starts_with(basename($normalizedDiskFile), '.')) {
                continue;
            }

            $size = Storage::size($normalizedDiskFile) ?: 0;
            $freedBytes += $size;
            $deletedOrphanFilesCount++;

            if ($deletedOrphanFilesCount <= 100) {
                $this->line(" - [Usuwanie nieaktualnego pliku] {$normalizedDiskFile} (" . $this->formatBytes($size) . ')');
            } elseif ($deletedOrphanFilesCount === 101) {
                $this->line(' - ... (kolejne usuwane pliki ukryte w logu dla czytelności)');
            }

            if (!$dryRun) {
                Storage::delete($normalizedDiskFile);
            }
        }

        $this->info('3. Czyszczenie pustych katalogów w storage/app/images...');
        $deletedDirsCount = $this->cleanEmptyDirectories('images', $dryRun);

        $this->newLine();
        $this->info('=== PODSUMOWANIE CZYSZCZENIA ZDJĘĆ ===');
        $this->table(
            ['Operacja', 'Liczba'],
            [
                ['Sprawdzone rekordy ProductImage w bazie', $images->count()],
                ['Przeniesione zdjęcia do właściwego folderu koloru/typu', $relocatedCount],
                ['Poprawione podwójne ukośniki (\\\\) w path_basic w bazie', $fixedDbPathsCount],
                ['Usunięte nieaktualne / osierocone pliki z dysku', $deletedOrphanFilesCount],
                ['Zwolnione miejsce na dysku', $this->formatBytes($freedBytes)],
                ['Usunięte puste foldery', $deletedDirsCount],
                ['Wyczyszczone puste referencje miniaturek (do regeneracji)', $clearedMissingVariantCount],
                ['Rekordy w bazie bez pliku na dysku', $missingOnDiskCount],
                ['Usunięte rekordy z bazy (--delete-missing-db)', $deletedDbRecordsCount],
            ]
        );

        if ($dryRun) {
            $this->warn('To był przebieg testowy (--dry-run). Aby faktycznie wykonać porządki, uruchom: php artisan images:clean');
        }

        return self::SUCCESS;
    }

    /**
     * Recursively remove empty directories inside $rootDir (bottom-up).
     */
    protected function cleanEmptyDirectories(string $rootDir, bool $dryRun = false): int
    {
        $allDirs = Storage::allDirectories($rootDir);

        // Sort deepest directories first
        usort($allDirs, function (string $a, string $b) {
            return substr_count($b, '/') <=> substr_count($a, '/');
        });

        $keptTopDirs = [
            'images/basic',
            'images/thumb',
            'images/webp',
            'images/square',
            'images/2x3',
        ];

        $deletedCount = 0;

        foreach ($allDirs as $dir) {
            $normDir = trim(str_replace('\\', '/', $dir), '/');
            if (in_array($normDir, $keptTopDirs, true)) {
                continue;
            }

            $files = Storage::files($normDir);
            $subDirs = Storage::directories($normDir);

            if (empty($files) && empty($subDirs)) {
                $deletedCount++;
                if (!$dryRun) {
                    Storage::deleteDirectory($normDir);
                }
            }
        }

        return $deletedCount;
    }

    protected function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $pow = (int) floor(log($bytes, 1024));
        $pow = min($pow, count($units) - 1);

        return round($bytes / (1024 ** $pow), 2) . ' ' . $units[$pow];
    }
}
