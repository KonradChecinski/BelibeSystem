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
        Schema::create('client_discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->smallInteger("type");
            $table->foreignId("product_model_id")->nullable()->references("id")->on("product_models")->restrictOnDelete();
            $table->foreignId("product_category_id")->nullable()->references("id")->on("product_categories")->restrictOnDelete();
            $table->foreignId("product_group_id")->nullable()->references("id")->on("product_groups")->restrictOnDelete();
            $table->foreignId("product_brand_id")->nullable()->references("id")->on("product_brands")->restrictOnDelete();
            $table->integer("value");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_discounts');
    }
};
