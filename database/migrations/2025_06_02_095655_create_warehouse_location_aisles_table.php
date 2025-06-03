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
        Schema::create('warehouse_location_aisles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_location_room_id')->references('id')->on('warehouse_location_rooms')->restrictOnDelete();
            $table->string('name'); // np. A, B
            $table->unsignedInteger('order')->default(9999); // Kolejność wyświetlania
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_location_aisles');
    }
};
