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
            $table->renameColumn('create_invoice', 'create_type');
        });
        Schema::table('warehouse_documents', function (Blueprint $table) {
            $table->integer('create_type')->default(0)->comment('0 - ZK, 1 - FS, 2 - MM')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouse_documents', function (Blueprint $table) {
            $table->renameColumn('create_type', 'create_invoice');
        });
        Schema::table('warehouse_documents', function (Blueprint $table) {
            $table->boolean('create_invoice')->default(0)->comment('0 - ZK, 1 - FS')->change();
        });
    }
};
