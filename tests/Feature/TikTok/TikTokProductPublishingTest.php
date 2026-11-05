<?php

namespace Tests\Feature\TikTok;

use App\Jobs\TikTok\TikTokChangeQuantity;
use App\Jobs\TikTok\TikTokChangeShow;
use App\Jobs\TikTok\TikTokPublishProductColor;
use App\Jobs\TikTok\TikTokUpdateOffers;
use App\Jobs\TikTok\TikTokUpdateProducts;
use App\Models\ProductB2cStat;
use App\Models\ProductBrand;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use App\Models\Products\ProductImage;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Models\Products\ProductSize;
use App\Models\ProductTiktokCategory;
use App\Models\TikTok\TiktokProduct;
use App\Models\TikTok\TiktokProductSku;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Laraditz\TikTok\Exceptions\TikTokAPIError;
use Laraditz\TikTok\Models\TiktokAccessToken;
use Laraditz\TikTok\Models\TiktokShop;
use Tests\TestCase;

class TikTokProductPublishingTest extends TestCase
{
    protected TiktokShop $shop;
    protected ProductModelColor $colorBlack;
    protected Product $productS;
    protected Product $productM;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'tiktok.app_key' => 'test_app_key',
            'tiktok.app_secret' => 'test_app_secret',
            'tiktok.shop_id' => 'shop_pl_123',
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
            'tiktok.logging.requests' => true,
        ]);

        // Rebind tiktok singleton with test app_key/app_secret
        $this->app->singleton('tiktok', function () {
            return new \Laraditz\TikTok\TikTok(
                app_key: config('tiktok.app_key'),
                app_secret: config('tiktok.app_secret'),
                shop_id: config('tiktok.shop_id'),
            );
        });

        $this->createTestSchema();
        $this->seedTestModels();
    }

    protected function createTestSchema(): void
    {
        Schema::create('tiktok_shops', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->nullable();
            $table->string('name')->nullable();
            $table->string('region')->nullable();
            $table->string('seller_type')->nullable();
            $table->text('cipher')->nullable();
            $table->timestamps();
        });

        Schema::create('tiktok_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('subjectable_type');
            $table->string('subjectable_id');
            $table->text('access_token')->nullable();
            $table->timestamp('access_token_expire_at')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('refresh_token_expire_at')->nullable();
            $table->string('open_id')->nullable();
            $table->string('seller_name')->nullable();
            $table->string('seller_base_region')->nullable();
            $table->integer('user_type')->nullable();
            $table->json('granted_scopes')->nullable();
            $table->timestamps();
        });

        Schema::create('tiktok_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('shop_id')->nullable();
            $table->string('action')->nullable();
            $table->text('url')->nullable();
            $table->json('request')->nullable();
            $table->json('response')->nullable();
            $table->string('request_id')->nullable();
            $table->string('code')->nullable();
            $table->string('message')->nullable();
            $table->string('error')->nullable();
            $table->timestamps();
        });

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
            $table->integer('b2c_gross_price')->default(14900);
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

        Schema::create('product_b2c_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->boolean('create_in_empik')->default(0);
            $table->boolean('update_in_empik')->default(0);
            $table->boolean('create_in_tiktok')->default(0);
            $table->boolean('update_in_tiktok')->default(0);
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

    protected function seedTestModels(): void
    {
        $this->shop = TiktokShop::create([
            'id' => 'shop_pl_123',
            'code' => 'PL123',
            'name' => 'Belibe PL',
            'region' => 'PL',
            'seller_type' => 'LOCAL',
            'cipher' => 'cipher_pl_123',
        ]);

        TiktokAccessToken::create([
            'subjectable_type' => TiktokShop::class,
            'subjectable_id' => $this->shop->id,
            'access_token' => 'tts_access_token_xyz',
            'access_token_expire_at' => now()->addDays(5),
            'refresh_token' => 'tts_refresh_token_xyz',
            'refresh_token_expire_at' => now()->addDays(30),
        ]);

        $brand = ProductBrand::create([
            'name' => 'Belibe',
            'tiktok_brand_id' => '998877',
        ]);

        $category = ProductTiktokCategory::create([
            'name' => 'Spodnie',
            'value' => '601226',
        ]);

        $model = ProductModel::create([
            'symbol' => 'APF',
            'name' => 'Art Pants Flow',
            'description_b2c' => '<p>Opis spodni Art Pants Flow</p>',
            'product_brand_id' => $brand->id,
            'product_tiktok_category_id' => $category->id,
        ]);

        ProductModelPrice::create([
            'product_model_id' => $model->id,
            'vat_rate' => 23,
            'b2c_net_price' => 12114,
            'b2c_gross_price' => 14900,
        ]);

        $this->colorBlack = ProductModelColor::create([
            'product_model_id' => $model->id,
            'shortcut' => 'BLK',
            'name' => 'Black',
            'b2c_product_name' => 'Art Pants Flow - Black',
        ]);

        Storage::fake('local');
        Storage::put('images/square/test-square.jpg', 'fake-jpeg-binary-data');

        ProductImage::create([
            'slug' => 'apf-blk-1',
            'product_model_color_id' => $this->colorBlack->id,
            'order' => 0,
            'path_basic' => 'APF/BLK/1/img.jpg',
            'path_square' => 'test-square.jpg',
            'type' => 1,
        ]);

        $sizeS = ProductSize::create(['name' => 'S']);
        $sizeM = ProductSize::create(['name' => 'M']);

        $this->productS = Product::create([
            'product_model_color_id' => $this->colorBlack->id,
            'product_size_id' => $sizeS->id,
            'symbol' => 'APF-BLK-S',
            'name' => 'Art Pants Flow Black S',
            'weight' => 200,
            'quantity' => 5,
            'show_in_tiktok' => true,
        ]);
        ProductBarcode::create([
            'product_id' => $this->productS->id,
            'barcode' => '5901234567890',
            'main' => true,
            'type' => 1,
        ]);

        $this->productM = Product::create([
            'product_model_color_id' => $this->colorBlack->id,
            'product_size_id' => $sizeM->id,
            'symbol' => 'APF-BLK-M',
            'name' => 'Art Pants Flow Black M',
            'weight' => 200,
            'quantity' => 8,
            'show_in_tiktok' => true,
        ]);
        ProductBarcode::create([
            'product_id' => $this->productM->id,
            'barcode' => '5901234567897',
            'main' => true,
            'type' => 1,
        ]);
    }

    public function test_it_publishes_product_color_and_is_idempotent_on_rerun(): void
    {
        $createCalls = 0;
        $updateCalls = 0;

        Http::fake(function (\Illuminate\Http\Client\Request $request) use (&$createCalls, &$updateCalls) {
            $url = $request->url();

            if (str_contains($url, '/product/202309/images/upload')) {
                return Http::response([
                    'code' => 0,
                    'message' => 'Success',
                    'request_id' => 'req_img_1',
                    'data' => [
                        'uri' => 'tos-maliva-i-o3syd03w52-us/uploaded_square_1',
                    ],
                ], 200);
            }

            if ($request->method() === 'POST' && str_contains($url, '/product/202309/products?')) {
                $createCalls++;
                return Http::response([
                    'code' => 0,
                    'message' => 'Success',
                    'request_id' => 'req_create_1',
                    'data' => [
                        'product_id' => '172938475610',
                        'skus' => [
                            ['id' => 'sku_tts_s_101', 'seller_sku' => 'APF-BLK-S'],
                            ['id' => 'sku_tts_m_102', 'seller_sku' => 'APF-BLK-M'],
                        ],
                    ],
                ], 200);
            }

            if ($request->method() === 'PUT' && str_contains($url, '/product/202309/products/172938475610')) {
                $updateCalls++;
                return Http::response([
                    'code' => 0,
                    'message' => 'Success',
                    'request_id' => 'req_update_1',
                    'data' => [
                        'product_id' => '172938475610',
                        'skus' => [
                            ['id' => 'sku_tts_s_101', 'seller_sku' => 'APF-BLK-S'],
                            ['id' => 'sku_tts_m_102', 'seller_sku' => 'APF-BLK-M'],
                        ],
                    ],
                ], 200);
            }

            return Http::response(['code' => 0, 'message' => 'Success'], 200);
        });

        // 1. Trigger Empik-style show change -> flags create_in_tiktok = 1 on ProductB2cStat
        (new TikTokChangeShow($this->productS->id, true))->handle();
        $this->assertDatabaseHas('product_b2c_stats', [
            'product_id' => $this->productS->id,
            'create_in_tiktok' => 1,
        ]);

        // 2. Run TikTokUpdateProducts -> dispatches TikTokPublishProductColor -> creates product in TikTok
        (new TikTokUpdateProducts())->handle();

        $this->assertSame(1, $createCalls);
        $this->assertSame(0, $updateCalls);

        // Verify TiktokProduct was saved with product_model_color_id and published status
        $this->assertDatabaseHas('tiktok_products', [
            'id' => '172938475610',
            'shop_id' => 'shop_pl_123',
            'product_model_color_id' => $this->colorBlack->id,
            'sync_status' => 'published',
        ]);

        // Verify both SKUs are linked to local Product IDs and have last_synced_quantity (available_b2c)
        $this->assertDatabaseHas('tiktok_product_skus', [
            'id' => 'sku_tts_s_101',
            'product_id' => '172938475610',
            'local_product_id' => $this->productS->id,
            'seller_sku' => 'APF-BLK-S',
            'last_synced_quantity' => 4,
        ]);

        $this->assertDatabaseHas('tiktok_product_skus', [
            'id' => 'sku_tts_m_102',
            'product_id' => '172938475610',
            'local_product_id' => $this->productM->id,
            'seller_sku' => 'APF-BLK-M',
            'last_synced_quantity' => 7,
        ]);

        // Verify ProductB2cStat flag was reset to 0
        $this->assertDatabaseHas('product_b2c_stats', [
            'product_id' => $this->productS->id,
            'create_in_tiktok' => 0,
        ]);

        // 3. Re-run TikTokPublishProductColor to test idempotency (must update, NOT create duplicate!)
        (new TikTokPublishProductColor($this->colorBlack->id))->handle();

        $this->assertSame(1, $createCalls, 'Re-running job must not create a duplicate product');
        $this->assertSame(1, $updateCalls, 'Re-running job must update the existing TikTok product');
        $this->assertSame(1, TiktokProduct::count());
    }

    public function test_it_records_failure_status_and_error_when_tiktok_api_fails(): void
    {
        ProductImage::query()->update(['tiktok_uri' => 'tos-maliva-i-o3syd03w52-us/cached_uri']);

        Http::fake([
            '*/product/202309/products*' => Http::response([
                'code' => 12052001,
                'message' => 'Invalid category_id for selected market',
                'request_id' => 'req_fail_1',
            ], 200),
        ]);

        try {
            (new TikTokPublishProductColor($this->colorBlack->id))->handle();
            $this->fail('Expected TikTokAPIError to be thrown');
        } catch (TikTokAPIError $e) {
            $this->assertStringContainsString('Invalid category_id', $e->getMessage());
        }

        $failedRecord = TiktokProduct::where('product_model_color_id', $this->colorBlack->id)->first();
        $this->assertNotNull($failedRecord);
        $this->assertSame('failed', $failedRecord->sync_status);
        $this->assertStringContainsString('Invalid category_id', (string) $failedRecord->last_sync_error);
    }

    public function test_it_syncs_inventory_via_update_offers_job(): void
    {
        TiktokProduct::create([
            'id' => '172938475610',
            'shop_id' => 'shop_pl_123',
            'product_model_color_id' => $this->colorBlack->id,
            'title' => 'Art Pants Flow - Black',
            'status' => 'ACTIVATE',
            'sync_status' => 'published',
        ]);

        TiktokProductSku::create([
            'id' => 'sku_tts_s_101',
            'product_id' => '172938475610',
            'local_product_id' => $this->productS->id,
            'seller_sku' => 'APF-BLK-S',
            'last_synced_quantity' => 5,
        ]);

        // Change local stock from 5 to 12 and run TikTokChangeQuantity
        $this->productS->update(['quantity' => 12]);
        (new TikTokChangeQuantity($this->productS))->handle();

        $this->assertDatabaseHas('product_b2c_stats', [
            'product_id' => $this->productS->id,
            'update_in_tiktok' => 1,
        ]);

        $inventoryUpdated = false;
        Http::fake(function (\Illuminate\Http\Client\Request $request) use (&$inventoryUpdated) {
            if (str_contains($request->url(), '/product/202309/products/172938475610/inventory/update')) {
                $inventoryUpdated = true;
                $body = $request->data();
                $this->assertSame('sku_tts_s_101', data_get($body, 'skus.0.id'));
                $this->assertSame(11, data_get($body, 'skus.0.inventory.0.quantity'));

                return Http::response([
                    'code' => 0,
                    'message' => 'Success',
                    'request_id' => 'req_inv_1',
                    'data' => [],
                ], 200);
            }

            return Http::response(['code' => 0, 'message' => 'Success'], 200);
        });

        (new TikTokUpdateOffers())->handle();

        $this->assertTrue($inventoryUpdated);
        $this->assertDatabaseHas('tiktok_product_skus', [
            'id' => 'sku_tts_s_101',
            'last_synced_quantity' => 11,
        ]);
        $this->assertDatabaseHas('product_b2c_stats', [
            'product_id' => $this->productS->id,
            'update_in_tiktok' => 0,
        ]);
    }
}

