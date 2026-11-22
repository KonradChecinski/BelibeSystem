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
        Schema::create('b2b_linked_product_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_model_id')->constrained('product_models')->cascadeOnDelete();
            $table->foreignId('linked_product_model_id')->constrained('product_models')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['product_model_id', 'linked_product_model_id'], 'b2b_linked_models_unique');
            $table->index('linked_product_model_id', 'b2b_linked_models_linked_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_linked_product_models');
    }
};
