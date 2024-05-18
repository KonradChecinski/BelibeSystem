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
        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->references("id")->on("orders")->restrictOnDelete();
            $table->foreignId("product_id")->nullable()->references("id")->on("products")->restrictOnDelete();
            $table->string("product_code")->nullable();
            $table->integer("quantity");
            $table->float("price");
            $table->float("discounted_price");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_products');
    }
};
