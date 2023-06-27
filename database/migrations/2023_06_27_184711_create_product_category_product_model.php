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
        Schema::create('product_category_product_model', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_category_id")->references("id")->on("product_categories");
            $table->foreignId("product_model_id")->references("id")->on("product_models");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_category_product_model');
    }
};
