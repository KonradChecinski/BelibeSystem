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
        Schema::table('client_invoices', function (Blueprint $table) {
            $table->foreignId('client_order_id')->after("client_id")->nullable()->references("id")->on("client_orders")->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_invoices', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_order_id');
        });
    }
};
