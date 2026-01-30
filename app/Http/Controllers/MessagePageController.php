<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MessagePageController extends Controller
{
    /**
     * Display the my messages page
     */
    public function index(): Response
    {
        return Inertia::render('my-messages');
    }
}
