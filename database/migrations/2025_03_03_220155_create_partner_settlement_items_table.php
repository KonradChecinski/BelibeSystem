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
        Schema::create('partner_settlement_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_settlement_id')->references("id")->on("partner_settlements")->restrictOnDelete();
            $table->foreignId('product_id')->references("id")->on("products")->restrictOnDelete();
            $table->foreignId("client_invoice_id")->nullable()->references("id")->on("client_invoices")->restrictOnDelete();
            $table->integer("quantity");
            $table->integer("price_net_original");
            $table->integer("price_gross_original");
            $table->integer("price_net_computed");
            $table->integer("price_gross_computed");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_settlement_items');
    }
};
