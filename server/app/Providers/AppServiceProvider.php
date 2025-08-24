<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\ThumbnailService;
use App\Services\SaleService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AuthService::class, fn() => new AuthService());
        $this->app->singleton(ThumbnailService::class, fn() => new ThumbnailService());
        $this->app->singleton(SaleService::class, fn() => new SaleService());
    }
}
