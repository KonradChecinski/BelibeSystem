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
        Schema::table('warehouse_documents', function (Blueprint $table) {
            $table->foreignId("user_id")->nullable()->after("create_invoice")->references("id")->on("users")->restrictOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouse_documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
