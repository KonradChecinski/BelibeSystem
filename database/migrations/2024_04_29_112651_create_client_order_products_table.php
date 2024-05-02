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
        Schema::create('client_order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_order_id")->references("id")->on("client_orders")->restrictOnDelete();
            $table->foreignId("product_id")->references("id")->on("products")->restrictOnDelete();
            $table->integer("quantity");
            $table->integer("price_net");
            $table->integer("price_gross");
            $table->integer("total_net");
            $table->integer("total_gross");
            $table->string("currency");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_order_products');
    }
};
