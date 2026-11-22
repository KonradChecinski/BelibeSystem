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
        Schema::create('promotion_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->constrained('promotions')->cascadeOnDelete();

            /**
             * Hierarchia szczegółowości (type):
             * 1 = Produkt (konkretny rozmiar w kolorze modelu)
             * 2 = Kolor modelu
             * 3 = Model
             * 4 = Kategoria
             * 5 = Grupa
             * 6 = Marka (Producent)
             * 7 = Wszystko
             */
            $table->smallInteger('type');

            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_model_color_id')->nullable()->constrained('product_model_colors')->cascadeOnDelete();
            $table->foreignId('product_model_id')->nullable()->constrained('product_models')->cascadeOnDelete();
            $table->foreignId('product_category_id')->nullable()->constrained('product_categories')->cascadeOnDelete();
            $table->foreignId('product_group_id')->nullable()->constrained('product_groups')->cascadeOnDelete();
            $table->foreignId('product_brand_id')->nullable()->constrained('product_brands')->cascadeOnDelete();

            $table->timestamps();

            $table->index(['promotion_id', 'type']);
            $table->index(['type', 'product_id']);
            $table->index(['type', 'product_model_color_id']);
            $table->index(['type', 'product_model_id']);
            $table->index(['type', 'product_category_id']);
            $table->index(['type', 'product_group_id']);
            $table->index(['type', 'product_brand_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_items');
    }
};
