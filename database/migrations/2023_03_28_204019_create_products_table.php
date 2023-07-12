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
            $table->foreignId("subiekt_id");
            $table->string("symbol", 50);
            $table->string("name", 200);
            $table->string("unit", 20);

            $table->integer("quantity")->default(0);
            $table->string("size", 10);


            $table->boolean("show_in_b2b");
            $table->boolean("show_in_b2c");
            $table->boolean("show_in_allegro");
            $table->boolean("show_in_subiekt");

            $table->text("description_b2b");
            $table->text("description_b2c");
            $table->text("description_allegro");

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
