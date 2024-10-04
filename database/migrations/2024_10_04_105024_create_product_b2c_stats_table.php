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
        Schema::create('product_b2c_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_id")->references("id")->on("products")->restrictOnDelete();
            $table->boolean("create_in_empik")->default(0);
            $table->boolean("update_in_empik")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_b2c_stats');
    }
};
