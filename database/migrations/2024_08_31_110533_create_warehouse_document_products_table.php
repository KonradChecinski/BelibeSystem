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
        Schema::create('warehouse_document_products', function (Blueprint $table) {
            $table->id();
            $table->integer("type")->default(1);
            $table->foreignId("warehouse_document_id")->references("id")->on("warehouse_documents")->restrictOnDelete();
            $table->foreignId("product_id")->nullable()->references("id")->on("products")->restrictOnDelete();
            $table->string("product_code")->nullable();
            $table->integer("quantity");
            $table->integer("original_price_net")->nullable();
            $table->integer("original_price_gross")->nullable();
            $table->integer("price_net")->nullable();
            $table->integer("price_gross")->nullable();
            $table->integer("vat_rate")->nullable();
            $table->string("currency");
            $table->string("comment")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_document_products');
    }
};
