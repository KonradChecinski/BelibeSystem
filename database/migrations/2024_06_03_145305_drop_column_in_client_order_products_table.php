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
        Schema::table('client_order_products', function (Blueprint $table) {
            $table->dropColumn('total_net');
            $table->dropColumn('total_gross');

            $table->renameColumn("price_gross", "vat_rate");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_order_products', function (Blueprint $table) {
            $table->integer("total_net");
            $table->integer("total_gross");

            $table->renameColumn("vat_rate", "price_gross");
        });
    }
};
