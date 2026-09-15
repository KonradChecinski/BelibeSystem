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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('courier_id')
                ->constrained()
                ->restrictOnDelete();

            $table->string('external_number')->nullable();

            $table->string('recipient_country', 2)->default('PL');

            $table->string('recipient_name');
            $table->string('recipient_company')->nullable();

            $table->string('recipient_street');
            $table->string('recipient_building_number');
            $table->string('recipient_apartment_number')->nullable();

            $table->string('recipient_postal_code');
            $table->string('recipient_city');

            $table->string('recipient_point')->nullable();

            $table->string('recipient_phone')->nullable();
            $table->string('recipient_email')->nullable();

            $table->morphs('orderable');

            $table->string('tracking_number')->nullable();

            $table->unsignedInteger('package_count')->default(1);

            $table->boolean('cod')->nullable();
            $table->unsignedInteger('cod_value')->nullable();

            $table->string('label_path')->nullable();


            $table->unique(['courier_id', 'tracking_number']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
