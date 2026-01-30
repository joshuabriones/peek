<?php

namespace App\Providers;

use App\Contracts\MessageRepositoryInterface;
use App\Contracts\MessageServiceInterface;
use App\Repositories\MessageRepository;
use App\Services\MessageService;
use Illuminate\Support\ServiceProvider;

class MessageServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind Repository Interface to Implementation
        $this->app->bind(
            MessageRepositoryInterface::class,
            MessageRepository::class
        );

        // Bind Service Interface to Implementation
        $this->app->bind(
            MessageServiceInterface::class,
            MessageService::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
