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
            $table
                ->foreignId("product_empik_category_id")
                ->nullable()
                ->after("product_clasp_id")
                ->references("id")
                ->on("product_empik_categories")
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_models', function (Blueprint $table) {
            $table->dropConstrainedForeignId("product_empik_category_id");
        });
    }
};
