<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class FollowPageController extends Controller
{
    /**
     * Display the followers and following page
     */
    public function index(): Response
    {
        return Inertia::render('followers-following');
    }
}
