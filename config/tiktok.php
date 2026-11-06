<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    'app_key' => env('TIKTOK_APP_KEY'),
    'app_secret' => env('TIKTOK_APP_SECRET'),
    'grant_type' => 'authorized_code',
    'sign_method' => env('TIKTOK_SIGN_METHOD', 'sha256'),
    'default_timezone' => env('TIKTOK_DEFAULT_TIMEZONE', 'UTC'),
    'shop_id' => env('TIKTOK_SHOP_ID'),
    'warehouse_id' => env('TIKTOK_WAREHOUSE_ID'),
    'manufacturer_id' => env('TIKTOK_MANUFACTURER_ID', '6ad769a6f66de4b7d99c98d6'),
    'responsible_person_id' => env('TIKTOK_RESPONSIBLE_PERSON_ID', '6ae204e13fc799d09cbb9ada'),
    'default_weight_grams' => (int)env('TIKTOK_DEFAULT_WEIGHT_GRAMS', 200),
    'package_weight_unit' => env('TIKTOK_PACKAGE_WEIGHT_UNIT', 'KILOGRAM'),
    'package_dimensions' => [
        'length' => (string)env('TIKTOK_PACKAGE_LENGTH', '15'),
        'width' => (string)env('TIKTOK_PACKAGE_WIDTH', '15'),
        'height' => (string)env('TIKTOK_PACKAGE_HEIGHT', '15'),
        'unit' => env('TIKTOK_PACKAGE_DIMENSION_UNIT', 'CENTIMETER'),
    ],
    'currency' => env('TIKTOK_CURRENCY', 'PLN'),
    'size_attribute_name' => env('TIKTOK_SIZE_ATTRIBUTE_NAME', 'Rozmiar'),
    'authorization_url' => env('TIKTOK_AUTHORIZATION_URL', 'https://services.tiktokshop.com/open/authorize'),
    'auth_url' => 'https://auth.tiktok-shops.com',
    'base_url' => 'https://open-api.tiktokglobalshop.com',
    'home_url' => env('TIKTOK_HOME_URL', '/'),
    'routes' => [
        'prefix' => 'tiktok',
        'auth' => [
            'access_token' => '/api/v2/token/get',
            'refresh_token' => '/api/v2/token/refresh',
        ],
        'authorization' => [
            'shops' => '/authorization/202309/shops'
        ],
        'event' => [
            'webhook_list' => '/event/202309/webhooks',
            'update_webhook' => 'PUT /event/202309/webhooks',
            'delete_webhook' => 'DELETE /event/202309/webhooks',
        ],
        'seller' => [
            'shops' => '/seller/202309/shops'
        ],
        'order' => [
            'list' => 'POST /order/202309/orders/search',
            'detail' => '/order/202309/orders',
            'price_detail' => '/order/202407/orders/{order_id}/price_detail',
            'external_orders' => '/order/202406/orders/{order_id}/external_orders',
            'add_external_orders' => 'POST /order/202406/orders/external_orders',
            'search_external_orders' => 'POST /order/202406/orders/external_order_search',
        ],
        'product' => [
            'get' => '/product/202309/products/{product_id}',
            'list' => 'POST /product/202502/products/search',
            'create' => 'POST /product/202309/products',
            'update' => 'PUT /product/202309/products/{product_id}',
            'partial_edit' => 'POST /product/202309/products/{product_id}/partial_edit',
            'activate' => 'POST /product/202309/products/activate',
            'deactivate' => 'POST /product/202309/products/deactivate',
            'update_inventory' => 'POST /product/202309/products/{product_id}/inventory/update',
            'update_price' => 'POST /product/202309/products/{product_id}/prices/update',
            'categories' => '/product/202309/categories',
            'category_rules' => '/product/202309/categories/{category_id}/rules',
            'category_attributes' => '/product/202309/categories/{category_id}/attributes',
            'brands' => '/product/202309/brands',
            'warehouses' => '/logistics/202309/warehouses',
            'create_size_chart' => 'POST /product/202610/size_charts',
            'edit_size_chart' => 'POST /product/202610/size_charts/edit',
        ],
        'return' => [
            'get' => '/return_refund/202309/returns/{return_id}/records',
            'list' => 'POST /return_refund/202309/returns/search',
        ],
        'finance' => [
            'statements' => '/finance/202309/statements',
            'payments' => '/finance/202605/payments',
            'withdrawals' => '/finance/202309/withdrawals',
            'unsettled_transactions' => '/finance/202507/orders/unsettled',
            'transactions_by_order' => '/finance/202501/orders/{order_id}/statement_transactions',
            'transactions_by_statement' => '/finance/202501/statements/{statement_id}/statement_transactions',
        ],
    ],
    'encrypt_tokens' => env('TIKTOK_ENCRYPT_TOKENS', false),
    'logging' => [
        'requests' => env('TIKTOK_LOG_REQUESTS', true),
        'redact_secrets' => env('TIKTOK_LOG_REDACT_SECRETS', false),
        'prune_after_days' => env('TIKTOK_LOG_PRUNE_AFTER_DAYS'),
    ],
    'middleware' => [\Illuminate\Routing\Middleware\SubstituteBindings::class],
];
