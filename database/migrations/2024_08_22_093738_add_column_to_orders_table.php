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
            $table->boolean("smart")->nullable()->after("delivery_gross");
            $table->string("login")->nullable()->after("email");
            $table->text("comment")->nullable()->after("tax_id");

            $table->string("subiekt_number")->nullable()->change();
            $table->string("order_id")->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn("smart");
            $table->dropColumn("login");
            $table->dropColumn("comment");
        });
    }
};
