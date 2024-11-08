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
        Schema::table('product_images', function (Blueprint $table) {
            $table->string("slug")->nullable()->after("id");
            $table->string("path_webp")->nullable()->after("path");
            $table->string("path_thumb")->nullable()->after("path");
            $table->string("path_square")->nullable()->after("path");

            $table->string("path")->nullable()->change();
            $table->renameColumn("path", "path_basic");

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumn("slug");
            $table->dropColumn("path_webp");
            $table->dropColumn("path_thumb");
            $table->dropColumn("path_square");

            $table->string("path")->nullable(false)->change();
            $table->renameColumn("path_basic", "path");
        });
    }
};
