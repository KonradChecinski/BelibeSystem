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
        Schema::create('product_model_warehouse_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_model_id')->references('id')->on('product_models')->restrictOnDelete();
            $table->foreignId('warehouse_location_id')->references('id')->on('warehouse_locations')->restrictOnDelete();
            $table->boolean('is_main')->default(false);
            $table->timestamps();

            $table->unique(['product_model_id', 'warehouse_location_id'], 'product_model_location_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_model_warehouse_location');
    }
};
