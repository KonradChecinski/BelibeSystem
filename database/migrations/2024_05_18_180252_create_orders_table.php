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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('type');
            $table->bigInteger('order_id')->unique();
            $table->timestamp('ordered_at');
            $table->float("sum");
            $table->string("payment_name");
            $table->string("shiping_name");
            $table->float("shipping_cost");
            $table->string("promo_code")->nullable();
            $table->string("email");
            $table->string("firstname");
            $table->string("lastname");
            $table->string("company")->nullable();
            $table->string("city");
            $table->string("postcode");
            $table->string("street1");
            $table->string("country");
            $table->string("phone");
            $table->string("tax_id")->nullable();
            $table->string("subiekt_number");
            $table->timestamp("subiekt_added_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
