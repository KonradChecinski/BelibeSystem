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
        if (!Schema::hasTable('product_tiktok_categories')) {
            Schema::create('product_tiktok_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('value')->default('');
                $table->timestamps();
            });
        }

        Schema::table('product_models', function (Blueprint $table) {
            if (!Schema::hasColumn('product_models', 'product_tiktok_category_id')) {
                $table->foreignId('product_tiktok_category_id')
                    ->nullable()
                    ->after('product_empik_category_id')
                    ->constrained('product_tiktok_categories')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_models', function (Blueprint $table) {
            if (Schema::hasColumn('product_models', 'product_tiktok_category_id')) {
                $table->dropForeign(['product_tiktok_category_id']);
                $table->dropColumn('product_tiktok_category_id');
            }
        });

        Schema::dropIfExists('product_tiktok_categories');
    }
};

