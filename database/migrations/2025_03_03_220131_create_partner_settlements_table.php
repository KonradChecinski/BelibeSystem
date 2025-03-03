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
        Schema::create('partner_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->references("id")->on("partners")->restrictOnDelete();
            $table->foreignId("user_id")->references("id")->on("users")->restrictOnDelete();
            $table->date("settlement_date")->nullable()->default(null);
            $table->integer("sold_net");
            $table->integer("sold_gross");
            $table->integer("return_net");
            $table->integer("return_gross");
            $table->integer("total_net");
            $table->integer("total_gross");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_settlements');
    }
};
