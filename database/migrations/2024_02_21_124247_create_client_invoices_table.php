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
        Schema::create('client_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->unique()->references("id")->on("clients")->restrictOnDelete();
            $table->smallInteger("type");
            $table->string("number");
            $table->integer("net_value");
            $table->integer("gross_value");
            $table->dateTime("datetime");
            $table->string("path");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_invoices');
    }
};
