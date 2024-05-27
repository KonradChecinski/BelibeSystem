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
        Schema::table('orders', function (Blueprint $table) {
            $table->string("number")->after("id");//->unique();
            $table->integer("total_quantity")->after("ordered_at");
            $table->renameColumn("shipping_cost", "delivery_gross");
            $table->renameColumn("shiping_name", "delivery_name");
            $table->renameColumn("sum", "total_gross");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn("delivery_gross", "shipping_cost");
            $table->renameColumn("delivery_name", "shiping_name");
            $table->renameColumn("total_gross", "sum");
            $table->dropColumn("number");
        });
    }
};
