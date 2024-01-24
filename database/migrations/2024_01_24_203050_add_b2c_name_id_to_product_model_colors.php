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
                ->foreignId("b2c_color_id")
                ->nullable()
                ->after("b2c_name")
                ->references("id")
                ->on("b2c_colors")
                ->restrictOnDelete();;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_model_colors', function (Blueprint $table) {
            $table->dropConstrainedForeignId("b2c_name_id");
        });
    }
};
