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
        Schema::create('warehouse_documents', function (Blueprint $table) {
            $table->id();
            $table->string("number")->unique();
            $table->integer("status");
            $table->integer("type");
            $table->foreignId("client_order_id")->nullable()->references("id")->on("client_orders")->restrictOnDelete();
            $table->integer("total_quantity");
            $table->integer("total_net")->nullable();
            $table->integer("total_gross")->nullable();
            $table->integer("discount");
            $table->integer("discounted_total_net")->nullable();
            $table->integer("discounted_total_gross")->nullable();
            $table->text("client_comment")->nullable();
            $table->text("user_comment")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_documents');
    }
};
