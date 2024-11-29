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
        Schema::table('dynamic_headers', function (Blueprint $table) {
            $table->json("parameters")->after("url")->nullable();
            $table->renameColumn("url", "route");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dynamic_headers', function (Blueprint $table) {
            $table->dropColumn("parameters");
            $table->renameColumn("route", "url");
        });
    }
};
