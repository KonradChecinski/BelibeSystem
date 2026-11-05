<?php

namespace Tests\Unit\TikTok;

use App\Helpers\TikTok\TikTokImageUploader;
use App\Helpers\TikTok\TikTokProductMapper;
use App\Models\ProductBrand;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductSize;
use App\Models\ProductSizeChart;
use App\Models\ProductTiktokCategory;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use InvalidArgumentException;
use Mockery;
use Tests\TestCase;

class TikTokProductMapperTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'tiktok.warehouse_id' => 'wh_pl_001',
            'tiktok.manufacturer_id' => '41j25w',
            'tiktok.responsible_person_id' => '1a21yvy',
            'tiktok.default_weight_grams' => 200,
            'tiktok.package_weight_unit' => 'KILOGRAM',
            'tiktok.package_dimensions' => [
                'length' => '15',
                'width' => '15',
                'height' => '15',
                'unit' => 'CENTIMETER',
            ],
            'tiktok.currency' => 'PLN',
            'tiktok.size_attribute_name' => 'Rozmiar',
        ]);

        $this->createTestSchema();
    }

    protected function createTestSchema(): void
    {
        Schema::create('product_brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tiktok_brand_id')->nullable();
            $table->timestamps();
        });

        Schema::create('product_tiktok_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('value')->default('');
            $table->timestamps();
        });

        Schema::create('product_size_charts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('table_data');
            $table->string('tiktok_template_id')->nullable();
            $table->string('tiktok_image_uri')->nullable();
            $table->timestamps();
        });

        Schema::create('product_models', function (Blueprint $table) {
            $table->id();
            $table->string('symbol');
            $table->string('slug')->nullable();
            $table->string('name');
            $table->text('description_b2c')->nullable();
            $table->foreignId('product_brand_id')->nullable();
            $table->foreignId('product_tiktok_category_id')->nullable();
            $table->foreignId('product_size_chart_id')->nullable();
            $table->timestamps();
        });

        Schema::create('product_model_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_model_id');
            $table->integer('vat_rate')->default(23);
            $table->integer('b2c_net_price')->default(10000);
            $table->integer('b2c_gross_price')->default(12300);
            $table->timestamps();
        });

        Schema::create('product_model_colors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_model_id');
            $table->string('shortcut');
            $table->string('name');
            $table->string('b2c_product_name')->nullable();
            $table->timestamps();
        });

        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_model_color_id');
            $table->foreignId('product_size_id')->nullable();
            $table->foreignId('product_unit_id')->nullable();
            $table->string('symbol');
            $table->string('name');
            $table->string('name_b2c')->nullable();
            $table->integer('weight')->default(200);
            $table->integer('quantity')->default(0);
            $table->boolean('show_in_tiktok')->default(0);
            $table->timestamps();
        });

        Schema::create('product_barcodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->string('barcode');
            $table->boolean('main')->default(0);
            $table->integer('type')->default(1);
            $table->timestamps();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->foreignId('product_model_color_id');
            $table->integer('order')->default(0);
            $table->string('path_basic')->nullable();
            $table->string('path_square')->nullable();
            $table->string('tiktok_uri')->nullable();
            $table->integer('type')->default(1);
            $table->integer('main')->default(0);
            $table->timestamps();
        });

        Schema::create('tiktok_products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('shop_id')->nullable();
            $table->foreignId('product_model_color_id')->nullable();
            $table->string('title')->nullable();
            $table->string('status')->nullable();
            $table->string('sync_status')->nullable()->default('pending');
            $table->text('last_sync_error')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->tinyInteger('has_draft')->nullable();
            $table->tinyInteger('is_not_for_sale')->nullable();
            $table->json('sales_regions')->nullable();
            $table->json('audit')->nullable();
            $table->integer('create_time')->nullable();
            $table->integer('update_time')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('tiktok_product_skus', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('product_id')->nullable();
            $table->foreignId('local_product_id')->nullable();
            $table->string('seller_sku')->nullable();
            $table->json('inventory')->nullable();
            $table->integer('last_synced_quantity')->nullable();
            $table->json('price')->nullable();
            $table->json('status_info')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('client_order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->foreignId('client_order_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });

        Schema::create('client_orders', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::create('warehouse_document_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->foreignId('warehouse_document_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });

        Schema::create('warehouse_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_order_id')->nullable();
            $table->timestamps();
        });

        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable();
            $table->foreignId('order_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    public function test_it_maps_product_model_color_and_size_variants_accurately(): void
    {
        $brand = ProductBrand::create([
            'name' => 'Aqua Speed',
            'tiktok_brand_id' => '7123456',
        ]);

        $category = ProductTiktokCategory::create([
            'name' => 'Spodnie damskie',
            'value' => '601226',
        ]);

        $sizeChart = ProductSizeChart::create([
            'name' => 'Stroje damskie',
            'tiktok_template_id' => '7612345678901234567',
            'table_data' => [
                'headers' => ['Rozmiar', 'S', 'M'],
                'rows' => [['Wzrost', '158-164', '162-168']],
            ],
        ]);

        $model = ProductModel::create([
            'symbol' => 'APF',
            'name' => 'Art Pants Flow',
            'description_b2c' => '<p>Wygodne spodnie dresowe</p>',
            'product_brand_id' => $brand->id,
            'product_tiktok_category_id' => $category->id,
            'product_size_chart_id' => $sizeChart->id,
        ]);

        ProductModelPrice::create([
            'product_model_id' => $model->id,
            'vat_rate' => 23,
            'b2c_net_price' => 10000,
            'b2c_gross_price' => 12999,
        ]);

        $colorBlack = ProductModelColor::create([
            'product_model_id' => $model->id,
            'shortcut' => 'BLK',
            'name' => 'Black',
            'b2c_product_name' => 'Art Pants Flow - Black',
        ]);

        ProductImage::create([
            'slug' => 'apf-blk-1',
            'product_model_color_id' => $colorBlack->id,
            'order' => 0,
            'path_basic' => 'APF/BLK/1/img1.jpg',
            'tiktok_uri' => 'tos-maliva-i-o3syd03w52-us/square_img_1',
            'type' => 1,
        ]);

        $sizeS = ProductSize::create(['name' => 'S']);
        $sizeM = ProductSize::create(['name' => 'M']);
        $sizeL = ProductSize::create(['name' => 'L']);

        $productS = Product::create([
            'product_model_color_id' => $colorBlack->id,
            'product_size_id' => $sizeS->id,
            'symbol' => 'APF-BLK-S',
            'name' => 'Art Pants Flow Black S',
            'weight' => 250,
            'quantity' => 7,
            'show_in_tiktok' => true,
        ]);
        ProductBarcode::create([
            'product_id' => $productS->id,
            'barcode' => '5901234567890',
            'main' => true,
            'type' => 1,
        ]);

        $productM = Product::create([
            'product_model_color_id' => $colorBlack->id,
            'product_size_id' => $sizeM->id,
            'symbol' => 'APF-BLK-M',
            'name' => 'Art Pants Flow Black M',
            'weight' => 250,
            'quantity' => 3,
            'show_in_tiktok' => true,
        ]);
        ProductBarcode::create([
            'product_id' => $productM->id,
            'barcode' => '5901234567897',
            'main' => true,
            'type' => 1,
        ]);

        // Unchecked size L (show_in_tiktok = false) must NOT be included in payload
        $productL = Product::create([
            'product_model_color_id' => $colorBlack->id,
            'product_size_id' => $sizeL->id,
            'symbol' => 'APF-BLK-L',
            'name' => 'Art Pants Flow Black L',
            'weight' => 250,
            'quantity' => 10,
            'show_in_tiktok' => false,
        ]);
        ProductBarcode::create([
            'product_id' => $productL->id,
            'barcode' => '5901234567804',
            'main' => true,
            'type' => 1,
        ]);

        $imageUploader = Mockery::mock(TikTokImageUploader::class);
        $imageUploader->shouldReceive('getOrUploadMainImageUri')
            ->once()
            ->andReturn('tos-maliva-i-o3syd03w52-us/square_img_1');

        $mapper = new TikTokProductMapper($imageUploader);
        $payload = $mapper->buildProductPayload($colorBlack);

        $this->assertSame('Art Pants Flow - Black', $payload['title']);
        $this->assertSame('<p>Wygodne spodnie dresowe</p>', $payload['description']);
        $this->assertSame('601226', $payload['category_id']);
        $this->assertSame('7123456', $payload['brand_id']);
        $this->assertSame([['uri' => 'tos-maliva-i-o3syd03w52-us/square_img_1']], $payload['main_images']);
        $this->assertSame(['template' => ['id' => '7612345678901234567']], $payload['size_chart']);
        $this->assertSame(['value' => '0.25', 'unit' => 'KILOGRAM'], $payload['package_weight']);
        $this->assertSame([
            'length' => '15',
            'width' => '15',
            'height' => '15',
            'unit' => 'CENTIMETER',
        ], $payload['package_dimensions']);
        $this->assertSame(['41j25w'], $payload['manufacturer_ids']);
        $this->assertSame(['1a21yvy'], $payload['responsible_person_ids']);

        // Only S and M should be in skus (1 level of sales_attributes: Rozmiar)
        $this->assertCount(2, $payload['skus']);

        $skuS = $payload['skus'][0];
        $this->assertSame('APF-BLK-S', $skuS['seller_sku']);
        $this->assertSame(['code' => '5901234567890', 'type' => 'EAN'], $skuS['identifier_code']);
        $this->assertSame([['name' => 'Rozmiar', 'value_name' => 'S']], $skuS['sales_attributes']);
        $this->assertSame(['amount' => '129.99', 'currency' => 'PLN'], $skuS['price']);
        $this->assertSame([['warehouse_id' => 'wh_pl_001', 'quantity' => 6]], $skuS['inventory']);

        $skuM = $payload['skus'][1];
        $this->assertSame('APF-BLK-M', $skuM['seller_sku']);
        $this->assertSame(['code' => '5901234567897', 'type' => 'EAN'], $skuM['identifier_code']);
        $this->assertSame([['name' => 'Rozmiar', 'value_name' => 'M']], $skuM['sales_attributes']);
        $this->assertSame([['warehouse_id' => 'wh_pl_001', 'quantity' => 2]], $skuM['inventory']);
    }

    public function test_it_throws_exception_when_barcode_or_category_is_missing(): void
    {
        $model = ProductModel::create([
            'symbol' => 'APF',
            'name' => 'Art Pants Flow',
            'description_b2c' => '<p>Opis</p>',
        ]);

        ProductModelPrice::create([
            'product_model_id' => $model->id,
            'b2c_gross_price' => 10000,
        ]);

        $color = ProductModelColor::create([
            'product_model_id' => $model->id,
            'shortcut' => 'BLK',
            'name' => 'Black',
            'b2c_product_name' => 'Art Pants Flow - Black',
        ]);

        $sizeS = ProductSize::create(['name' => 'S']);
        Product::create([
            'product_model_color_id' => $color->id,
            'product_size_id' => $sizeS->id,
            'symbol' => 'APF-BLK-S',
            'name' => 'Art Pants Flow Black S',
            'quantity' => 5,
            'show_in_tiktok' => true,
        ]);

        $mapper = new TikTokProductMapper(Mockery::mock(TikTokImageUploader::class));

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Brak przypisanej kategorii TikTok');

        $mapper->buildProductPayload($color);
    }

    public function test_it_builds_structured_size_chart_payload_from_local_table_data(): void
    {
        $sizeChart = ProductSizeChart::create([
            'name' => 'Stroje damskie',
            'table_data' => [
                'headers' => ['Rozmiar', 'XS', 'S', 'M'],
                'rows' => [
                    ['Rozmiar EU', '34', '36', '38'],
                    ['Miska', 'AA-A', 'A-AB', 'A-B'],
                    ['Obwód w biuście', '72-78', '78-84', '84-90'],
                ],
            ],
        ]);

        $mapper = new TikTokProductMapper(Mockery::mock(TikTokImageUploader::class));
        $payload = $mapper->buildSizeChartPayload($sizeChart, '601226');

        $this->assertSame('601226', $payload['category_id']);
        $this->assertSame('REUSABLE_TEMPLATE', $payload['size_chart_mode']);
        $this->assertSame('Stroje damskie', $payload['template_name']);
        $this->assertFalse($payload['is_one_size']);
        $this->assertSame('BODY_MEASUREMENTS', $payload['size_chart_data']['measurement_type']);
        $this->assertSame('METRIC', $payload['size_chart_data']['unit_system']);

        $this->assertSame([
            ['id' => 'size_chart_size_system_size', 'name' => 'Rozmiar'],
            ['id' => 'size_chart_size_system_eu', 'name' => 'Rozmiar EU'],
            ['name' => 'Miska'],
            ['name' => 'Obwód w biuście'],
        ], $payload['size_chart_data']['table']['headers']);

        $this->assertSame([
            [
                'cells' => [
                    ['value' => 'XS'],
                    ['value' => '34'],
                    ['value' => 'AA-A'],
                    ['value' => '72-78'],
                ],
            ],
            [
                'cells' => [
                    ['value' => 'S'],
                    ['value' => '36'],
                    ['value' => 'A-AB'],
                    ['value' => '78-84'],
                ],
            ],
            [
                'cells' => [
                    ['value' => 'M'],
                    ['value' => '38'],
                    ['value' => 'A-B'],
                    ['value' => '84-90'],
                ],
            ],
        ], $payload['size_chart_data']['table']['rows']);
    }
}

