<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    /**
     * Display the welcome/home page
     */
    public function index(): Response
    {
        return Inertia::render('welcome_new', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
