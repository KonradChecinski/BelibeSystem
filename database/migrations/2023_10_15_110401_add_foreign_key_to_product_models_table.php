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
                ->foreignId("product_gs1_gpc_id")
                ->nullable()
                ->after("name_6_char")
                ->references("id")
                ->on("gs1_gpcs")
                ->restrictOnDelete();


            $table
                ->foreignId("product_gs1_brand_id")
                ->nullable()
                ->after("name_6_char")
                ->references("id")
                ->on("gs1_brands")
                ->restrictOnDelete();

            $table
                ->foreignId("product_brand_id")
                ->nullable()
                ->after("name_6_char")
                ->references("id")
                ->on("product_brands")
                ->restrictOnDelete();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_models', function (Blueprint $table) {
            $table->dropConstrainedForeignId("product_brand_id");
            $table->dropConstrainedForeignId("product_gs1_brand_id");
            $table->dropConstrainedForeignId("product_gs1_gpc_id");
        });
    }
};
