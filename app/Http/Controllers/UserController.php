<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'nickname' => $user->nickname,
            'bio' => $user->bio,
        ]);
    }

    public function getMessages(User $user)
    {
        $auth = Auth::user();

        // Check if mutual follow
        if (!$auth->isMutualFollow($user)) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        $messages = $user->messages()
            ->select('id', 'content', 'latitude', 'longitude', 'read_count', 'tag', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    public function getMyMessages()
    {
        $auth = Auth::user();

        $messages = $auth->messages()
            ->select('id', 'content', 'latitude', 'longitude', 'read_count', 'tag', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }
}
