<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// CSRF Cookie Route for Sanctum
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token set']);
});

Route::get('/', function () {
    return Inertia::render('welcome_new', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('map', function () {
        return Inertia::render('map');
    })->name('map');

    Route::get('my-profile', function () {
        return Inertia::render('my-profile');
    })->name('my-profile');

    Route::get('my-messages', function () {
        return Inertia::render('my-messages');
    })->name('my-messages');

    Route::get('profile', function () {
        return Inertia::render('profile');
    })->name('profile');

    Route::get('followers-following', function () {
        return Inertia::render('followers-following');
    })->name('followers-following');
});

require __DIR__.'/settings.php';
