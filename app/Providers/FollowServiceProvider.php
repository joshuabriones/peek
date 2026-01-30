<?php

namespace App\Providers;

use App\Contracts\FollowRepositoryInterface;
use App\Contracts\FollowServiceInterface;
use App\Repositories\FollowRepository;
use App\Services\FollowService;
use Illuminate\Support\ServiceProvider;

class FollowServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind Repository Interface to Implementation
        $this->app->bind(
            FollowRepositoryInterface::class,
            FollowRepository::class
        );

        // Bind Service Interface to Implementation
        $this->app->bind(
            FollowServiceInterface::class,
            FollowService::class
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
