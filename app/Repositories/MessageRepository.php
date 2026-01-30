<?php

namespace App\Repositories;

use App\Contracts\MessageRepositoryInterface;
use App\Models\Message;
use App\Models\MessageRead;
use Illuminate\Support\Collection;

class MessageRepository implements MessageRepositoryInterface
{
    /**
     * Create a new message
     *
     * @param int $userId
     * @param array $data
     * @return Message
     */
    public function create(int $userId, array $data): Message
    {
        return Message::create([
            'user_id' => $userId,
            'content' => $data['content'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'tag' => $data['tag'] ?? null,
        ]);
    }

    /**
     * Get all messages for today
     *
     * @return Collection
     */
    public function getTodayMessages(): Collection
    {
        return Message::today()
            ->with('user:id,nickname')
            ->get();
    }

    /**
     * Get top messages for today
     *
     * @param int $limit
     * @return Collection
     */
    public function getTopMessagesToday(int $limit = 10): Collection
    {
        return Message::topToday($limit)
            ->with('user:id,nickname')
            ->get();
    }

    /**
     * Get user's messages for today
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserMessagesToday(int $userId): Collection
    {
        return Message::where('user_id', $userId)
            ->today()
            ->withCount('reads')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Increment message read count
     *
     * @param int $messageId
     * @return bool
     */
    public function incrementReadCount(int $messageId): bool
    {
        return Message::where('id', $messageId)->increment('read_count') > 0;
    }

    /**
     * Check if user has read a message
     *
     * @param int $userId
     * @param int $messageId
     * @return bool
     */
    public function hasUserReadMessage(int $userId, int $messageId): bool
    {
        return MessageRead::where('user_id', $userId)
            ->where('message_id', $messageId)
            ->exists();
    }

    /**
     * Mark message as read by user
     *
     * @param int $userId
     * @param int $messageId
     * @return bool True if this is a new read
     */
    public function markAsRead(int $userId, int $messageId): bool
    {
        $read = MessageRead::firstOrCreate([
            'user_id' => $userId,
            'message_id' => $messageId,
        ]);

        return $read->wasRecentlyCreated;
    }

    /**
     * Get count of messages user has read from another user
     *
     * @param int $userId
     * @param int $creatorId
     * @return int
     */
    public function getReadCountByUser(int $userId, int $creatorId): int
    {
        return MessageRead::where('user_id', $userId)
            ->whereHas('message', function ($query) use ($creatorId) {
                $query->where('user_id', $creatorId);
            })
            ->count();
    }

    /**
     * Check if user has unlocked a profile
     *
     * @param int $userId
     * @param int $unlockedUserId
     * @return bool
     */
    public function hasUnlockedProfile(int $userId, int $unlockedUserId): bool
    {
        return \DB::table('unlocked_profiles')
            ->where('user_id', $userId)
            ->where('unlocked_user_id', $unlockedUserId)
            ->exists();
    }

    /**
     * Unlock a user's profile
     *
     * @param int $userId
     * @param int $unlockedUserId
     * @return bool
     */
    public function unlockProfile(int $userId, int $unlockedUserId): bool
    {
        // Check if already unlocked
        if ($this->hasUnlockedProfile($userId, $unlockedUserId)) {
            return false;
        }

        \DB::table('unlocked_profiles')->insert([
            'user_id' => $userId,
            'unlocked_user_id' => $unlockedUserId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return true;
    }

    /**
     * Get top message threshold
     *
     * @return int
     */
    public function getTopMessageThreshold(): int
    {
        return Message::today()
            ->withCount('reads')
            ->orderByDesc('reads_count')
            ->skip(9)
            ->first()?->reads_count ?? 0;
    }
}
