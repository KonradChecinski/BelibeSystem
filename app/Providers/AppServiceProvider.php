<?php

namespace App\Providers;

use App\Extensions\CustomDatabaseSessionHandler;
use App\Singleton\Subiekt;
use App\Singleton\SubiektDodatki;
use Illuminate\Support\Facades\Event;
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

        // Kompatybilność modeli laraditz/tiktok (definiujących metodę casts() z Laravel 11) z Laravel 10
        Event::listen(['eloquent.saving: Laraditz\TikTok\Models\*', 'eloquent.retrieved: Laraditz\TikTok\Models\*'], function (string $event, array $models) {
            foreach ($models as $model) {
                if (method_exists($model, 'casts')) {
                    $ref = new \ReflectionMethod($model, 'casts');
                    $ref->setAccessible(true);
                    $casts = $ref->invoke($model);
                    if (is_array($casts)) {
                        $model->mergeCasts($casts);
                        if (str_starts_with($event, 'eloquent.saving:')) {
                            $raw = $model->getAttributes();
                            foreach ($casts as $key => $castType) {
                                if (array_key_exists($key, $raw) && is_array($raw[$key])) {
                                    $model->setAttribute($key, $raw[$key]);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}
