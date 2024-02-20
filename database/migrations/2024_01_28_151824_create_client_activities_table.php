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
        Schema::create('client_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId("client_id")->references("id")->on("clients")->restrictOnDelete();
            $table->foreignId("activity_type_id")->references("id")->on("b2b_activity_types")->restrictOnDelete();
            $table->dateTime("datetime");
            $table->text("description");
            $table->foreignId("user_id")->references("id")->on("users")->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_activities');
    }
};
