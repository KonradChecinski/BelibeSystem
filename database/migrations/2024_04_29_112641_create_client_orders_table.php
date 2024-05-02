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
        Schema::create('client_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->string("number")->unique();
            $table->integer("status");
            $table->foreignId("payment_id")->references("id")->on("b2b_payments")->restrictOnDelete();
            $table->foreignId("delivery_id")->references("id")->on("b2b_deliveries")->restrictOnDelete();
            $table->foreignId("client_location_id")->references("id")->on("client_locations")->restrictOnDelete();
            $table->integer("total_quantity");
            $table->integer("total_net");
            $table->integer("total_gross");
            $table->integer("discount");
            $table->integer("discounted_total_net");
            $table->integer("discounted_total_gross");
            $table->integer("delivery_net");
            $table->integer("delivery_gross");
            $table->string("currency");
            $table->text("comment")->nullable();
            $table->string("subiekt_number")->nullable();
            $table->timestamp("subiekt_added_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_orders');
    }
};
