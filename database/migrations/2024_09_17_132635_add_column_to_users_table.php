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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('subiekt_id')->nullable()->after("id");
            $table->string("lastname")->default("")->after("name");
            $table->string("firstname")->default("")->after("name");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('subiekt_id');
            $table->dropColumn('lastname');
            $table->dropColumn('firstname');
        });
    }
};
