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
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_model_color_id")->references("id")->on("product_model_colors")->restrictOnDelete();
            $table->unsignedInteger("order");
            $table->string("path");

            $table->unsignedInteger("width");
            $table->unsignedInteger("height");
            $table->unsignedInteger("type");
            $table->boolean("publish");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
