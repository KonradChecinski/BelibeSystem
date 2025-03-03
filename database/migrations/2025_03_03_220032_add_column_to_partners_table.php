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
        Schema::table('partners', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->default(null)->after("id")->references("id")->on("clients")->restrictOnDelete();
            $table->integer("warehouse_id")->nullable()->default(null)->after("name");
            $table->integer("subiekt_category_id")->nullable()->default(null)->after("name");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->dropConstrainedForeignId("client_id");
            $table->dropColumn("warehouse_id");
            $table->dropColumn("subiekt_category_id");
        });
    }
};
