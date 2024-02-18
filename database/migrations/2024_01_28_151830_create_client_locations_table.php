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
        Schema::create('client_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->foreignId("country_id")->references("id")->on("b2b_countries")->restrictOnDelete();
            $table->string("city", 50);
            $table->string("street", 50);
            $table->string("building_number", 50);
            $table->string("apartment_number", 50)->nullable()->default(null);
            $table->string("postal_code", 20);
            $table->text("note");
            $table->tinyInteger("active");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_locations');
    }
};
