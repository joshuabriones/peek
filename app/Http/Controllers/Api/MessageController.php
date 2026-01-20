<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->canPostMessageToday()) {
            return response()->json([
                'message' => 'Daily message limit reached',
                'remaining' => 0,
            ], 429);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'tag' => 'nullable|string|max:50',
        ]);

        $message = $user->messages()->create($validated);

        return response()->json([
            'message' => $message,
            'remaining' => $user->messagesTodayRemaining(),
        ], 201);
    }

    public function markAsRead(Request $request, Message $message): JsonResponse
    {
        $user = $request->user();

        // Don't increment read count for creator's own message
        if ($user->id === $message->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot read own message',
            ]);
        }

        // Prevent duplicate reads - only increment if this is first read by this user
        $read = MessageRead::firstOrCreate([
            'user_id' => $user->id,
            'message_id' => $message->id,
        ]);

        // Only increment if this was a new read (wasRecentlyCreated is true)
        if ($read->wasRecentlyCreated) {
            $message->increment('read_count');
        }

        // Check if profile should be unlocked
        $this->checkProfileUnlock($user, $message->user);

        return response()->json([
            'success' => true,
            'profileUnlocked' => $user->unlockedProfiles()->where('unlocked_user_id', $message->user_id)->exists(),
            'newReadCount' => $message->fresh()->read_count,
        ]);
    }

    private function checkProfileUnlock(User $currentUser, User $messageCreator): void
    {
        if ($currentUser->id === $messageCreator->id) {
            return; // Can't unlock own profile
        }

        $readCount = $currentUser->hasReadUsersMessages($messageCreator);

        // Unlock profile if user has read 2+ messages from creator
        if ($readCount >= 2 && !$currentUser->unlockedProfiles()->where('unlocked_user_id', $messageCreator->id)->exists()) {
            $currentUser->unlockedProfiles()->attach($messageCreator->id);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $messages = Message::today()
            ->with('user:id,name,nickname')
            ->get();

        return response()->json($messages);
    }

    public function topToday(): JsonResponse
    {
        $topMessages = Message::topToday(10)
            ->with('user:id,name,nickname')
            ->get();

        return response()->json($topMessages);
    }

    public function remaining(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'remaining' => $user->messagesTodayRemaining(),
        ]);
    }
}

