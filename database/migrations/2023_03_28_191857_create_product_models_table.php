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
        Schema::create('product_models', function (Blueprint $table) {
            $table->id();
            $table->string("symbol")->unique();
            $table->string("name");
            $table
                ->foreignId("product_group_id")
                ->nullable()
                ->references("id")
                ->on("product_groups")
                ->restrictOnDelete();


            $table->text("description_b2b");
            $table->text("description_b2c");
            $table->text("description_allegro");
            $table->string("name_11_char")->default("");
            $table->string("name_6_char")->default("");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_models');
    }
};
