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
        Schema::table('client_discounts', function (Blueprint $table) {
            $table->boolean('show_discount_on_invoice')->default(false)->after('product_brand_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_discounts', function (Blueprint $table) {
            $table->dropColumn('show_discount_on_invoice');
        });
    }
};
