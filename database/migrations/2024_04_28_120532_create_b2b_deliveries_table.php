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
        Schema::create('b2b_deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('price_net');
            $table->integer('price_gross');
            $table->integer('free_from')->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedInteger('delivery_time_min')->default(0);
            $table->unsignedInteger('delivery_time_max')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_deliveries');
    }
};
