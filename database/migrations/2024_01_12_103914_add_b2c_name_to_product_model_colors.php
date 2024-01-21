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
        Schema::table('product_model_colors', function (Blueprint $table) {

            $table
                ->string("b2c_product_name", 100)
                ->after("product_b2c_color_id");
            $table
                ->string("b2c_name")
                ->after("product_b2c_color_id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_model_colors', function (Blueprint $table) {
            $table->dropColumn("b2c_name");
            $table->dropColumn("b2c_product_name");

        });
    }
};
