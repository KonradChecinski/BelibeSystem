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
        Schema::table('clients', function (Blueprint $table) {
            $table->boolean("newsletter")->default(false)->after("nip");
            $table->boolean("blacklist")->default(false)->after("nip");
            $table->foreignId("user_id")->after("nip")->references("id")->on("users")->restrictOnDelete();
            $table->foreignId("source_of_acquisition_id")->after("nip")->references("id")->on("b2b_source_of_acquisitions")->restrictOnDelete();
            $table->smallInteger("priority")->default(1)->after("nip");
            $table->foreignId("status_id")->after("nip")->references("id")->on("b2b_statuses")->restrictOnDelete();

            $table->string("email", 50)->after("nip");
            $table->string("phone", 20)->after("nip");
            $table->string("postal_code", 20)->after("nip");
            $table->string("apartment_number", 50)->after("nip")->nullable();
            $table->string("building_number", 50)->after("nip");
            $table->string("street", 50)->after("nip");
            $table->string("city", 50)->after("nip");

            $table->foreignId("country_id")->after("nip")->references("id")->on("b2b_countries")->restrictOnDelete();
            $table->bigInteger("subiekt_id")->after("id")->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn("blacklist");
            $table->dropConstrainedForeignId("user_id");
            $table->dropConstrainedForeignId("source_of_acquisition_id");
            $table->dropColumn("priority");
            $table->dropConstrainedForeignId("status_id");
            $table->dropColumn("email");
            $table->dropColumn("phone");
            $table->dropColumn("postal_code");
            $table->dropColumn("apartment_number");
            $table->dropColumn("building_number");
            $table->dropColumn("street");
            $table->dropColumn("city");
            $table->dropConstrainedForeignId("country_id");
            $table->dropColumn("subiekt_id");
        });
    }
};
