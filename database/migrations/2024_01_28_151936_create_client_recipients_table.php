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
        Schema::create('client_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->foreignId("country_id")->references("id")->on("b2b_countries")->restrictOnDelete();
            $table->bigInteger("subiekt_id");
            $table->string("name");
            $table->string("city", 50);
            $table->string("street", 50);
            $table->string("building_number", 50);
            $table->string("apartment_number", 50);
            $table->string("postal_code", 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_recipients');
    }
};
