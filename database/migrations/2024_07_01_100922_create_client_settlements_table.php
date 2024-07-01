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
        Schema::create('client_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->references("id")->on("clients")->restrictOnDelete();
            $table->foreignId('document_id')->nullable()->references("id")->on("client_invoices")->restrictOnDelete();
            $table->bigInteger('subiekt_id');
            $table->smallInteger('settlement')->comment("0,1,2");
            $table->tinyInteger('type')->comment("1,2");
            $table->dateTime('datetime');
            $table->string('number');
            $table->dateTime('date_of_payment')->nullable();
            $table->dateTime('date_of_last_payment')->nullable();
//            $table->integer('days_of_delay')->nullable();
            $table->bigInteger('original_value');
            $table->bigInteger('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_settlements');
    }
};
