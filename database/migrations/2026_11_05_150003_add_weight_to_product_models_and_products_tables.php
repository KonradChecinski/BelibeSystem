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
        Schema::table('product_models', function (Blueprint $table) {
            if (!Schema::hasColumn('product_models', 'weight')) {
                $table->integer('weight')->default(200)->after('name');
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'weight')) {
                $table->integer('weight')->default(200)->after('name_b2c');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'weight')) {
                $table->dropColumn('weight');
            }
        });

        Schema::table('product_models', function (Blueprint $table) {
            if (Schema::hasColumn('product_models', 'weight')) {
                $table->dropColumn('weight');
            }
        });
    }
};

