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
        Schema::create('product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_id")->references('id')->on('products')->restrictOnDelete();
            $table->integer('vat_rate')->default(23);
            $table->integer('wholesale_net_price');
            $table->integer('wholesale_gross_price');
            $table->integer('retail_net_price');
            $table->integer('retail_gross_price');
            $table->string("currency", 3)->default("PLN");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_prices');
    }
};
