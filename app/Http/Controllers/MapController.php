<?php

namespace App\Http\Controllers;

use App\Contracts\MessageServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function __construct(
        private MessageServiceInterface $messageService
    ) {}

    public function getMessages(Request $request): JsonResponse
    {
        $result = $this->messageService->getMapMessages($request->user());

        return response()->json($result['data'], $result['status']);
    }
}
