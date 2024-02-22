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
        Schema::create('b2b_payment_client', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->foreignId("b2b_payment_id")->references("id")->on("b2b_payments")->restrictOnDelete();
            $table->boolean("discount")->default(false);
            $table->integer("discount_value")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_payment_client');
    }
};
