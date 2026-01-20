<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function getMessages(Request $request)
    {
        $messages = Message::today()
            ->with([
                'user:id,name,nickname',
                'reads:id,user_id,message_id'
            ])
            ->get()
            ->map(function ($message) use ($request) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'latitude' => $message->latitude,
                    'longitude' => $message->longitude,
                    'readCount' => $message->read_count,
                    'user' => $message->user,
                    'userHasRead' => $request->user()?->messageReads()->where('message_id', $message->id)->exists() ?? false,
                    'isTopMessage' => $message->read_count >= $this->getTopMessageThreshold(),
                    'created_at' => $message->created_at,
                ];
            });

        return response()->json($messages);
    }

    private function getTopMessageThreshold(): int
    {
        // Dynamically calculate threshold based on top 10 reads
        return Message::today()
            ->withCount('reads')
            ->orderByDesc('reads_count')
            ->skip(9)
            ->first()?->reads_count ?? 0;
    }
}

