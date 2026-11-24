<?php

namespace App\Jobs\System;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class CleanOldLogsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;
    public int $timeout = 300;

    protected int $days;

    /**
     * Create a new job instance.
     */
    public function __construct(int $days = 7)
    {
        $this->days = $days;
        $this->onQueue('linux');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $cutoffDate = Carbon::now()->subDays($this->days)->format('Y-m-d H:i:s');
        $logsPath = storage_path('logs');

        $filesToClean = [
            'laravel.log',
            'worker-default.log',
            'worker-websocket.log',
            'worker.log',
        ];

        for ($i = 1; $i <= 10; $i++) {
            $filesToClean[] = "worker.log.{$i}";
        }

        // Clean any daily rotated laravel logs older than $days (e.g. laravel-YYYY-MM-DD.log)
        foreach (glob($logsPath . '/laravel-*.log') ?: [] as $dailyLog) {
            if (preg_match('/laravel-(\d{4}-\d{2}-\d{2})\.log$/', $dailyLog, $matches)) {
                if ($matches[1] . ' 23:59:59' < $cutoffDate) {
                    @unlink($dailyLog);
                }
            }
        }

        foreach ($filesToClean as $fileName) {
            $filePath = $logsPath . DIRECTORY_SEPARATOR . $fileName;

            if (!is_file($filePath) || !is_readable($filePath) || !is_writable($filePath)) {
                continue;
            }

            if ($fileName === 'worker-websocket.log') {
                $this->truncateToLastLines($filePath, 200);
                continue;
            }

            $this->filterFileByDate($filePath, $cutoffDate);
        }
    }

    /**
     * Filter a log file in-place, keeping only entries newer than or equal to $cutoffDate.
     * Supports both Laravel logs ("[YYYY-MM-DD HH:MM:SS] ...") and worker logs ("  YYYY-MM-DD HH:MM:SS ...").
     */
    protected function filterFileByDate(string $filePath, string $cutoffDate): void
    {
        $source = @fopen($filePath, 'rb');
        if (!$source) {
            return;
        }

        $tempPath = $filePath . '.tmp.' . uniqid('', true);
        $temp = @fopen($tempPath, 'wb');
        if (!$temp) {
            fclose($source);
            return;
        }

        $keepCurrentBlock = false;
        $dateRegex = '/^\s*\[?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]?/';

        while (($line = fgets($source)) !== false) {
            if (preg_match($dateRegex, $line, $matches)) {
                $keepCurrentBlock = ($matches[1] >= $cutoffDate);
            }

            if ($keepCurrentBlock) {
                fwrite($temp, $line);
            }
        }

        fclose($temp);
        fclose($source);

        // Copy filtered content back in-place so open file descriptors (e.g. Supervisor) stay valid
        $target = @fopen($filePath, 'cb');
        $filtered = @fopen($tempPath, 'rb');

        if ($target && $filtered) {
            if (flock($target, LOCK_EX)) {
                ftruncate($target, 0);
                rewind($target);
                stream_copy_to_stream($filtered, $target);
                fflush($target);
                flock($target, LOCK_UN);
            }
        }

        if ($filtered) {
            fclose($filtered);
        }
        if ($target) {
            fclose($target);
        }

        @unlink($tempPath);
    }

    /**
     * For log files without timestamps (like worker-websocket.log), keep the last N lines
     * or empty the file on weekly cleanups so it doesn't grow indefinitely.
     */
    protected function truncateToLastLines(string $filePath, int $maxLines = 200): void
    {
        $lines = @file($filePath);
        if ($lines === false) {
            return;
        }

        $keptLines = array_slice($lines, -$maxLines);

        $target = @fopen($filePath, 'cb');
        if ($target) {
            if (flock($target, LOCK_EX)) {
                ftruncate($target, 0);
                rewind($target);
                fwrite($target, implode('', $keptLines));
                fflush($target);
                flock($target, LOCK_UN);
            }
            fclose($target);
        }
    }
}
