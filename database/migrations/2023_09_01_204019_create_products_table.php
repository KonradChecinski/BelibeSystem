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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
//            $table->foreignId("product_model_id")->references("id")->on("product_models")->restrictOnDelete();
            $table->foreignId("product_model_color_id")->references("id")->on("product_model_colors")->restrictOnDelete();
            $table->foreignId("subiekt_id")->nullable();
            $table->string("symbol", 50)->unique();
            $table->string("name", 200);
            $table->foreignId("product_unit_id")->references("id")->on("product_units")->restrictOnDelete();;

            $table->integer("quantity")->default(0);
            $table->foreignId("product_size_id")->references("id")->on("settings_dictionary_sizes")->restrictOnDelete();


            $table->boolean("show_in_b2b")->default(0);
            $table->boolean("show_in_b2c")->default(0);
            $table->boolean("show_in_allegro")->default(0);
            $table->boolean("show_in_subiekt")->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
