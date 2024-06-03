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
        Schema::table('b2b_carts', function (Blueprint $table) {
            $table->renameColumn('price_gross', 'vat_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('b2b_carts', function (Blueprint $table) {
            $table->renameColumn('vat_rate', 'price_gross');
        });
    }
};
