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
        Schema::create('client_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->string("title", 100);
            $table->text("text");
            $table->dateTime("datetime");
            $table->foreignId("user_id")->references("id")->on("users")->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_tasks');
    }
};
