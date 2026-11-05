<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('product_models', 'weight')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->dropColumn('weight');
            });
        }

        if (!Schema::hasTable('product_size_charts')) {
            Schema::create('product_size_charts', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->json('table_data');
                $table->string('tiktok_template_id')->nullable();
                $table->string('tiktok_image_uri')->nullable();
                $table->timestamps();
            });

            $now = now();
            $initialCharts = [
                [
                    'name' => 'Stroje damskie',
                    'table_data' => json_encode([
                        'headers' => ['Rozmiar', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'],
                        'rows' => [
                            ['Rozmiar EU', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'],
                            ['Miska', 'AA-A', 'A-AB', 'A-B', 'B-C', 'C', 'C-D', 'D-DD', 'DD', 'DD-E', 'E-F', 'F-G', 'GG'],
                            ['Wzrost', '158-164', '158-164', '162-168', '164-170', '164-170', '166-170', '166-170', '168-172', '168-172', '168-174', '168-174', '168-176'],
                            ['Obwód w biuście', '72-78', '78-84', '84-90', '90-96', '96-102', '102-108', '108-114', '114-120', '120-126', '126-132', '132-138', '138-144'],
                            ['Obwód pod biustem', '65-70', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100', '100-105', '105-110', '110-115', '115-120'],
                            ['Obwód pasa', '62-64', '64-68', '68-74', '74-82', '84-90', '90-96', '96-100', '98-104', '100-106', '104-110', '108-114', '112-120'],
                            ['Obwód bioder', '84-86', '86-90', '90-96', '96-102', '102-108', '108-114', '114-120', '120-124', '124-128', '128-132', '132-136', '136-142'],
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Kąpielówki męskie',
                    'table_data' => json_encode([
                        'headers' => ['Rozmiar', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
                        'rows' => [
                            ['Rozmiar EU', '42-44', '44-46', '46-48', '48-50', '50-52', '52-54', '54-56', '56-68'],
                            ['Wzrost', '162-166', '164-168', '166-170', '168-172', '170-174', '172-178', '174-180', '176-182'],
                            ['Obwód pasa', '66-70', '70-76', '76-82', '82-88', '88-94', '94-100', '100-106', '106-112'],
                            ['Obwód bioder', '86-92', '92-98', '98-104', '104-110', '110-116', '116-120', '120-124', '124-128'],
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Stroje dziewczęce',
                    'table_data' => json_encode([
                        'headers' => ['Wzrost', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158'],
                        'rows' => [
                            ['Wiek', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13'],
                            ['Obwód klatki piersiowej', '52-54', '54-56', '56-58', '58-60', '60-62', '62-64', '64-66', '66-68', '68-70', '70-72'],
                            ['Obwód pasa', '50-52', '52-54', '54-56', '56-58', '58-60', '60-62', '62-64', '64-66', '66-68', '68-70'],
                            ['Obwód bioder', '54-57', '57-60', '60-63', '63-66', '66-69', '69-72', '72-75', '75-78', '78-81', '81-84'],
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Kąpielówki chłopięce',
                    'table_data' => json_encode([
                        'headers' => ['Wzrost', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158'],
                        'rows' => [
                            ['Wiek', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13'],
                            ['Obwód pasa', '48-50', '50-52', '52-54', '54-56', '56-58', '58-60', '60-62', '62-64', '64-66', '66-68'],
                            ['Obwód bioder', '58-61', '61-64', '64-67', '67-70', '70-73', '73-76', '76-79', '79-82', '82-85', '85-88'],
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ];

            DB::table('product_size_charts')->insert($initialCharts);
        }

        if (!Schema::hasColumn('product_models', 'product_size_chart_id')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->foreignId('product_size_chart_id')
                    ->nullable()
                    ->after('product_tiktok_category_id')
                    ->constrained('product_size_charts')
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('product_models', 'product_size_chart_id')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->dropConstrainedForeignId('product_size_chart_id');
            });
        }

        Schema::dropIfExists('product_size_charts');

        if (!Schema::hasColumn('product_models', 'weight')) {
            Schema::table('product_models', function (Blueprint $table) {
                $table->unsignedInteger('weight')->default(200)->after('name');
            });
        }
    }
};

