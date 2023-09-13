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
        Schema::create('product_model_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_model_id")->references('id')->on('product_models')->restrictOnDelete();
            $table->integer('vat_rate')->default(23);
            $table->integer('wholesale_net_price')->default(0);
            $table->integer('wholesale_gross_price')->default(0);
            $table->integer('retail_net_price')->default(0);
            $table->integer('retail_gross_price')->default(0);
            $table->string("currency")->default("PLN");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_model_prices');
    }
};
