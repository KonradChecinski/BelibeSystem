<?php

namespace App\Providers;

use App\Extensions\CustomDatabaseSessionHandler;
use App\Singleton\Subiekt;
use App\Singleton\SubiektDodatki;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Subiekt::class);
        $this->app->singleton(SubiektDodatki::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
//        URL::forceScheme('https');

        Session::extend('custom-database', function ($app) {
            $table = $app['config']['session.table'];
            $lifetime = $app['config']['session.lifetime'];
            $connection = $app['db']->connection($app['config']['session.connection']);

            return new CustomDatabaseSessionHandler($connection, $table, $lifetime, $app);
        });

        Password::defaults(function () {
            $rule = Password::min(8);

            return $this->app->isProduction()
                ? $rule->mixedCase()->uncompromised()->letters()->numbers()
                : $rule;
        });
    }
}
