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
        Schema::create('product_model_colors', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_model_id")->references("id")->on("product_models")->restrictOnDelete();
            $table->string("shortcut", 10);
            $table->string("name");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_model_colors');
    }
};
