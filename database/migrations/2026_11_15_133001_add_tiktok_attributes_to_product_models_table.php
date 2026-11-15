<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('product_models', 'tiktok_attributes')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->json('tiktok_attributes')
                    ->nullable()
                    ->after('product_size_chart_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('product_models', 'tiktok_attributes')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->dropColumn('tiktok_attributes');
            });
        }
    }
};

