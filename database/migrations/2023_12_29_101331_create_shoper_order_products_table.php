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
        Schema::create('shoper_order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId("shoper_order_id")->references("id")->on("shoper_orders")->restrictOnDelete();
            $table->string("code");
            $table->integer("quantity");
            $table->float("price");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shoper_order_products');
    }
};
