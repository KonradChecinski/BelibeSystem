<?php

namespace App\Providers;

use App\Extensions\CustomDatabaseSessionHandler;
use App\Singleton\Subiekt;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Subiekt::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        URL::forceScheme('https');

        Session::extend('custom-database', function ($app) {
            $table = $app['config']['session.table'];
            $lifetime = $app['config']['session.lifetime'];
            $connection = $app['db']->connection($app['config']['session.connection']);

            return new CustomDatabaseSessionHandler($connection, $table, $lifetime, $app);
        });
    }
}
