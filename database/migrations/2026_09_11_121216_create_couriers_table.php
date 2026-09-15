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
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('tracking_url')->nullable();

            $table->string('logo')->nullable();

            $table->boolean('supports_cod')->default(false);
            $table->boolean('allows_multiple_packages')->default(false);

            $table->boolean('weight_enabled')->default(false);
            $table->boolean('weight_required')->default(false);

            $table->boolean('width_enabled')->default(false);
            $table->boolean('width_required')->default(false);

            $table->boolean('height_enabled')->default(false);
            $table->boolean('height_required')->default(false);

            $table->boolean('depth_enabled')->default(false);
            $table->boolean('depth_required')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
