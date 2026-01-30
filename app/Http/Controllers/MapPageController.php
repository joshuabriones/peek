<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MapPageController extends Controller
{
    /**
     * Display the map page
     */
    public function index(): Response
    {
        return Inertia::render('map');
    }
}
