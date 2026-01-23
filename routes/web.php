<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome_new', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('map', function () {
        return Inertia::render('map');
    })->name('map');

    Route::get('my-messages', function () {
        return Inertia::render('my-messages');
    })->name('my-messages');
});

require __DIR__.'/settings.php';
