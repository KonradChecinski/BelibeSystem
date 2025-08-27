<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('partner_exports', function (Blueprint $table) {
            $table->boolean('image_webp')->default(false)->after('type');
            $table->boolean('image_square')->default(false)->after('type');
            $table->boolean('image_basic')->default(false)->after('type');
            $table->boolean('description')->default(false)->after('type');
            $table->boolean('retail_gross_price')->default(false)->after('type');
            $table->boolean('wholesale_net_price')->default(false)->after('type');
            $table->boolean('availability')->default(false)->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partner_exports', function (Blueprint $table) {
            $table->dropColumn('image_webp');
            $table->dropColumn('image_square');
            $table->dropColumn('image_basic');
            $table->dropColumn('description');
            $table->dropColumn('retail_gross_price');
            $table->dropColumn('wholesale_net_price');
            $table->dropColumn('availability');
        });
    }
};
