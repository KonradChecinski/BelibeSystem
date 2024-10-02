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
        Schema::table('product_model_prices', function (Blueprint $table) {
            $table->integer('b2c_gross_price')->after('retail_gross_price')->default(0);
            $table->integer('b2c_net_price')->after('retail_gross_price')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_model_prices', function (Blueprint $table) {
            $table->dropColumn('retail_net_price');
            $table->dropColumn('retail_gross_price');
        });
    }
};
