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
        Schema::table('product_brands', function (Blueprint $table) {
            if (!Schema::hasColumn('product_brands', 'tiktok_brand_id')) {
                $table->string('tiktok_brand_id')->nullable()->after('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_brands', function (Blueprint $table) {
            if (Schema::hasColumn('product_brands', 'tiktok_brand_id')) {
                $table->dropColumn('tiktok_brand_id');
            }
        });
    }
};

