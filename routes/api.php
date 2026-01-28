<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MapController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// All endpoints - auth handled by web middleware from Inertia
Route::get('/map/messages', [MapController::class, 'getMessages']);
Route::get('/messages', [MessageController::class, 'index']);
Route::get('/messages/top/today', [MessageController::class, 'topToday']);
Route::get('/messages/remaining', [MessageController::class, 'remaining']);
Route::get('/messages/my/today', [MessageController::class, 'myMessagesToday']);
Route::post('/messages', [MessageController::class, 'store']);
Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);

// User routes
Route::get('/users/{user}', [UserController::class, 'show']);

// Follow routes
Route::middleware('auth')->group(function () {
    Route::get('/users/me/messages', [UserController::class, 'getMyMessages']);
    Route::post('/users/{user}/follow', [FollowController::class, 'follow']);
    Route::post('/users/{user}/unfollow', [FollowController::class, 'unfollow']);
    Route::get('/users/{user}/followers', [FollowController::class, 'getFollowers']);
    Route::get('/users/{user}/following', [FollowController::class, 'getFollowing']);
    Route::get('/users/{user}/follow-status', [FollowController::class, 'getFollowStatus']);
    Route::get('/users/{user}/messages', [UserController::class, 'getMessages']);
});


