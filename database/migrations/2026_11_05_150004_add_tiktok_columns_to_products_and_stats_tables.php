<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'show_in_tiktok')) {
                $table->boolean('show_in_tiktok')->default(0)->after('show_in_empik');
            }
        });

        Schema::table('product_b2c_stats', function (Blueprint $table) {
            if (!Schema::hasColumn('product_b2c_stats', 'create_in_tiktok')) {
                $table->boolean('create_in_tiktok')->default(0)->after('update_in_empik');
            }
            if (!Schema::hasColumn('product_b2c_stats', 'update_in_tiktok')) {
                $table->boolean('update_in_tiktok')->default(0)->after('create_in_tiktok');
            }
        });

        Schema::table('product_images', function (Blueprint $table) {
            if (!Schema::hasColumn('product_images', 'tiktok_uri')) {
                $table->string('tiktok_uri')->nullable()->after('path_2x3');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'tiktok_uri')) {
                $table->dropColumn('tiktok_uri');
            }
        });

        Schema::table('product_b2c_stats', function (Blueprint $table) {
            if (Schema::hasColumn('product_b2c_stats', 'update_in_tiktok')) {
                $table->dropColumn('update_in_tiktok');
            }
            if (Schema::hasColumn('product_b2c_stats', 'create_in_tiktok')) {
                $table->dropColumn('create_in_tiktok');
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'show_in_tiktok')) {
                $table->dropColumn('show_in_tiktok');
            }
        });
    }
};

