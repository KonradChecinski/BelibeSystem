<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" href="{{ asset("/storage/favicons>B.ico") }}" type="image/x-icon">
    <link rel="apple-touch-icon" href="{{ asset("/storage/favicons>B.png") }}">

    <meta name="author" content="Konrad Checinski">


    {{--        <meta name="description" content="Page description">--}}
    {{--        <meta property="og:title" content="Unique page title - My Site">--}}
    {{--        <meta property="og:description" content="Page description">--}}
    {{--        <meta property="og:image" content="https://www.mywebsite.com/image.jpg">--}}
    {{--        <meta property="og:image:alt" content="Image description">--}}
    {{--        <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">--}}
    {{--        <meta property="og:type" content="website">--}}
    {{--        <meta name="twitter:card" content="summary_large_image">--}}
    {{--        <meta property="og:url" content="https://www.mywebsite.com/page">--}}
    {{--        <link rel="canonical" href="https://www.mywebsite.com/page">--}}

    <link rel="icon" href="{{ asset("/storage/favicons/B.ico") }}">
    <link rel="icon" href="{{ asset("/storage/favicons/B.svg") }}" type="image/svg+xml">
    {{--        <link rel="icon" sizes="192x192" href="nice-highres.png">--}}
    {{--        <link rel="apple-touch-icon" href="/apple-touch-icon.png">--}}
    {{--        <link rel="manifest" href="/my.webmanifest">--}}
    {{--        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />--}}
    {{--        <meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />--}}
    {{--        <meta name="theme-color" content="#db5945">--}}

    <!-- https://www.matuzo.at/blog/html-boilerplate/ -->

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet"/>

    <script>
        const global = globalThis;
    </script>
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>

