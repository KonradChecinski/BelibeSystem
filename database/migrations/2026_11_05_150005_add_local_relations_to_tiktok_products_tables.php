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
        Schema::table('tiktok_products', function (Blueprint $table) {
            if (!Schema::hasColumn('tiktok_products', 'product_model_color_id')) {
                $table->foreignId('product_model_color_id')
                    ->nullable()
                    ->after('shop_id')
                    ->constrained('product_model_colors')
                    ->nullOnDelete();
                $table->index(['shop_id', 'product_model_color_id'], 'tiktok_products_shop_color_idx');
            }
            if (!Schema::hasColumn('tiktok_products', 'sync_status')) {
                $table->string('sync_status', 50)->nullable()->default('pending')->after('status');
                $table->index('sync_status');
            }
            if (!Schema::hasColumn('tiktok_products', 'last_sync_error')) {
                $table->text('last_sync_error')->nullable()->after('sync_status');
            }
            if (!Schema::hasColumn('tiktok_products', 'last_synced_at')) {
                $table->timestamp('last_synced_at')->nullable()->after('last_sync_error');
            }
        });

        Schema::table('tiktok_product_skus', function (Blueprint $table) {
            if (!Schema::hasColumn('tiktok_product_skus', 'local_product_id')) {
                $table->foreignId('local_product_id')
                    ->nullable()
                    ->after('product_id')
                    ->constrained('products')
                    ->nullOnDelete();
                $table->index('local_product_id');
            }
            if (!Schema::hasColumn('tiktok_product_skus', 'last_synced_quantity')) {
                $table->integer('last_synced_quantity')->nullable()->after('inventory');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tiktok_product_skus', function (Blueprint $table) {
            if (Schema::hasColumn('tiktok_product_skus', 'last_synced_quantity')) {
                $table->dropColumn('last_synced_quantity');
            }
            if (Schema::hasColumn('tiktok_product_skus', 'local_product_id')) {
                $table->dropForeign(['local_product_id']);
                $table->dropIndex(['local_product_id']);
                $table->dropColumn('local_product_id');
            }
        });

        Schema::table('tiktok_products', function (Blueprint $table) {
            if (Schema::hasColumn('tiktok_products', 'last_synced_at')) {
                $table->dropColumn('last_synced_at');
            }
            if (Schema::hasColumn('tiktok_products', 'last_sync_error')) {
                $table->dropColumn('last_sync_error');
            }
            if (Schema::hasColumn('tiktok_products', 'sync_status')) {
                $table->dropIndex(['sync_status']);
                $table->dropColumn('sync_status');
            }
            if (Schema::hasColumn('tiktok_products', 'product_model_color_id')) {
                $table->dropIndex('tiktok_products_shop_color_idx');
                $table->dropForeign(['product_model_color_id']);
                $table->dropColumn('product_model_color_id');
            }
        });
    }
};

