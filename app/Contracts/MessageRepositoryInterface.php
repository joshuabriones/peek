<?php

namespace App\Contracts;

use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Collection;

interface MessageRepositoryInterface
{
    /**
     * Create a new message
     *
     * @param int $userId
     * @param array $data
     * @return Message
     */
    public function create(int $userId, array $data): Message;

    /**
     * Get all messages for today
     *
     * @return Collection
     */
    public function getTodayMessages(): Collection;

    /**
     * Get top messages for today
     *
     * @param int $limit
     * @return Collection
     */
    public function getTopMessagesToday(int $limit = 10): Collection;

    /**
     * Get user's messages for today
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserMessagesToday(int $userId): Collection;

    /**
     * Increment message read count
     *
     * @param int $messageId
     * @return bool
     */
    public function incrementReadCount(int $messageId): bool;

    /**
     * Check if user has read a message
     *
     * @param int $userId
     * @param int $messageId
     * @return bool
     */
    public function hasUserReadMessage(int $userId, int $messageId): bool;

    /**
     * Mark message as read by user
     *
     * @param int $userId
     * @param int $messageId
     * @return bool True if this is a new read
     */
    public function markAsRead(int $userId, int $messageId): bool;

    /**
     * Get count of messages user has read from another user
     *
     * @param int $userId
     * @param int $creatorId
     * @return int
     */
    public function getReadCountByUser(int $userId, int $creatorId): int;

    /**
     * Check if user has unlocked a profile
     *
     * @param int $userId
     * @param int $unlockedUserId
     * @return bool
     */
    public function hasUnlockedProfile(int $userId, int $unlockedUserId): bool;

    /**
     * Unlock a user's profile
     *
     * @param int $userId
     * @param int $unlockedUserId
     * @return bool
     */
    public function unlockProfile(int $userId, int $unlockedUserId): bool;

    /**
     * Get top message threshold
     *
     * @return int
     */
    public function getTopMessageThreshold(): int;
}
