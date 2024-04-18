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
        Schema::create('b2b_carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients");
            $table->foreignId("product_id")->references("id")->on("products");
            $table->integer("quantity");
            $table->integer("price_net");
            $table->integer("price_gross");
            $table->string("currency");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_carts');
    }
};
