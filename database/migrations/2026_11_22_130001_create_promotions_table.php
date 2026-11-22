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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();

            // Główne kanały sprzedaży (B2B / B2C) + przygotowane flagi dla konkretnych kanałów B2C na przyszłość
            $table->boolean('is_b2b')->default(false);
            $table->boolean('is_b2c')->default(false);
            $table->boolean('is_shoper')->default(false);
            $table->boolean('is_allegro')->default(false);
            $table->boolean('is_empik')->default(false);
            $table->boolean('is_tiktok')->default(false);

            // Typ obniżki: 1 = Procentowy (%), 2 = Kwotowy (zł), 3 = Stała cena promocyjna (zł)
            $table->smallInteger('discount_type')->default(1);
            // Wartość w setnych (setne procenta dla typu 1, grosze dla typu 2 i 3)
            $table->integer('discount_value')->default(0);

            $table->boolean('show_discount_on_invoice')->default(true);
            $table->boolean('is_active')->default(true);

            // Czas trwania promocji (ends_at = null oznacza promocję bezterminową / do odwołania)
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
