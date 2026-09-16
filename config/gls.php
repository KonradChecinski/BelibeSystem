<?php

return [
    // Dane logowania i ustawienia środowiska (pobierane z .env)
    'user' => env('GLS_USER'),
    'password' => env('GLS_PASSWORD'),
    'test_mode' => env('GLS_TEST_MODE', true),

    // Adres WSDL - w trybie testowym ustawiony na ADE test; w produkcji podaj swój adres w .env (GLS_WSDL_URL)
    'wsdl' => env('GLS_TEST_MODE', true)
        ? 'https://ade-test.gls-poland.com/adeplus/pm1/ade_webapi2.php?wsdl'
        : env('GLS_WSDL_URL', 'https://ade.gls-poland.com/adeplus/pm1/ade_webapi2.php?wsdl'),

    // Opcje przekazywane do SoapClient
    'options' => [
        'trace' => true,
        'exceptions' => true,
        // cache_wsdl można zmienić według potrzeb
        'cache_wsdl' => WSDL_CACHE_NONE,
    ],

    // Domyślne ustawienia nadawcy (opcjonalne), można nadpisać przy tworzeniu przesyłki
    'default_sender' => [
        'company' => null,
        'name' => null,
        'street' => null,
        'postal' => null,
        'city' => null,
        'country' => 'PL',
        'phone' => null,
        'email' => null,
    ],
];
