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
        Schema::table('client_orders', function (Blueprint $table) {
            $table->renameColumn("comment", "user_comment");
        });
        Schema::table('client_orders', function (Blueprint $table) {
            $table->text("client_comment")->after("user_comment")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_orders', function (Blueprint $table) {
            $table->renameColumn("user_comment", "comment");
            $table->dropColumn("client_comment");
        });
    }
};
