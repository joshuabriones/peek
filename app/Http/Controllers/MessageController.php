<?php

namespace App\Http\Controllers;

use App\Contracts\MessageServiceInterface;
use App\Http\Requests\Message\MarkMessageAsReadRequest;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(
        private MessageServiceInterface $messageService
    ) {}

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $result = $this->messageService->createMessage(
            $request->user(),
            $request->validated()
        );

        return response()->json(
            $result['data'] ?? ['message' => $result['message']],
            $result['status']
        );
    }

    public function markAsRead(MarkMessageAsReadRequest $request, Message $message): JsonResponse
    {
        $result = $this->messageService->markAsRead($request->user(), $message);

        return response()->json(
            $result['data'] ?? ['message' => $result['message']],
            $result['status']
        );
    }

    public function index(Request $request): JsonResponse
    {
        $result = $this->messageService->getTodayMessages();

        return response()->json($result['data'], $result['status']);
    }

    public function topToday(): JsonResponse
    {
        $result = $this->messageService->getTopMessagesToday(10);

        return response()->json($result['data'], $result['status']);
    }

    public function remaining(Request $request): JsonResponse
    {
        $result = $this->messageService->getRemainingMessages($request->user());

        return response()->json($result['data'], $result['status']);
    }

    public function myMessagesToday(Request $request): JsonResponse
    {
        $result = $this->messageService->getMyMessagesToday($request->user());

        return response()->json($result['data'], $result['status']);
    }
}
