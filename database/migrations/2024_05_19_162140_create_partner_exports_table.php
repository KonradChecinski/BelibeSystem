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
        Schema::create('partner_exports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->references("id")->on("partners")->restrictOnDelete();
            $table->integer("type");
            $table->uuid("path");
            $table->string("cron", 20);
            $table->timestamp("completed_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_exports');
    }
};
