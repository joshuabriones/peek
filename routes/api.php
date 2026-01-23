<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MapController;
use Illuminate\Support\Facades\Route;

// All endpoints - auth handled by web middleware from Inertia
Route::get('/map/messages', [MapController::class, 'getMessages']);
Route::get('/messages', [MessageController::class, 'index']);
Route::get('/messages/top/today', [MessageController::class, 'topToday']);
Route::get('/messages/remaining', [MessageController::class, 'remaining']);
Route::get('/messages/my/today', [MessageController::class, 'myMessagesToday']);
Route::post('/messages', [MessageController::class, 'store']);
Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);
