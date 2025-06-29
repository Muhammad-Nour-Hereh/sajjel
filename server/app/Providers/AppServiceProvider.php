<?php

namespace App\Providers;

use App\Services\AuthService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {
        $this->app->singleton(AuthService::class, fn() => new AuthService());
        $this->app->singleton(OpenAIService::class, function ($app) {
            return new OpenAIService(
                $app->make(GuildbookFileService::class),
                config('services.openai.api_key')
            );
        });
    }
}
