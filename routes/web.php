<?php

use App\Http\Controllers\FollowPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MapPageController;
use App\Http\Controllers\MessagePageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// CSRF Cookie Route for Sanctum
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token set']);
});

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('map', [MapPageController::class, 'index'])->name('map');
    Route::get('my-profile', [ProfileController::class, 'myProfile'])->name('my-profile');
    Route::get('my-messages', [MessagePageController::class, 'index'])->name('my-messages');
    Route::get('profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('followers-following', [FollowPageController::class, 'index'])->name('followers-following');
});

require __DIR__.'/settings.php';
