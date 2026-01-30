<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the current user's profile page
     */
    public function myProfile(): Response
    {
        return Inertia::render('my-profile');
    }

    /**
     * Display another user's profile page
     */
    public function show(): Response
    {
        return Inertia::render('profile');
    }
}
