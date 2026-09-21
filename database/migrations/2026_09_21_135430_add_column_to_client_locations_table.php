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
        Schema::table('client_locations', function (Blueprint $table) {
            $table->string('email')->nullable()->after('postal_code');
            $table->string('phone')->nullable()->after('postal_code');
        });

        Schema::table('client_locations', function (Blueprint $table) {
            $table->renameColumn('note', 'name');
        });

        Schema::table('client_locations', function (Blueprint $table) {
            $table->string('name')->after('country_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_locations', function (Blueprint $table) {
            $table->dropColumn('email');
            $table->dropColumn('phone');
        });

        Schema::table('client_locations', function (Blueprint $table) {
            $table->renameColumn('name', 'note');
        });

        Schema::table('client_locations', function (Blueprint $table) {
            $table->string('note')->after('postal_code')->change();
        });
    }
};
