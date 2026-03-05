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
        Schema::table('partner_settlements', function (Blueprint $table) {
            $table->date("invoice_date")->after("settlement_date")->default(date("Y-m-d"));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partner_settlements', function (Blueprint $table) {
            $table->dropColumn("invoice_date");
        });
    }
};
