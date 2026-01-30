<?php

namespace App\Contracts;

use App\Models\Message;
use App\Models\User;

interface MessageServiceInterface
{
    /**
     * Create a new message
     *
     * @param User $user
     * @param array $data
     * @return array ['success' => bool, 'message' => string|null, 'data' => array|null, 'status' => int]
     */
    public function createMessage(User $user, array $data): array;

    /**
     * Mark a message as read by a user
     *
     * @param User $user
     * @param Message $message
     * @return array ['success' => bool, 'message' => string|null, 'data' => array|null, 'status' => int]
     */
    public function markAsRead(User $user, Message $message): array;

    /**
     * Get all messages for today
     *
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getTodayMessages(): array;

    /**
     * Get top messages for today
     *
     * @param int $limit
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getTopMessagesToday(int $limit = 10): array;

    /**
     * Get remaining messages count for user today
     *
     * @param User $user
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getRemainingMessages(User $user): array;

    /**
     * Get user's messages for today
     *
     * @param User $user
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getMyMessagesToday(User $user): array;

    /**
     * Get messages for map view
     *
     * @param User|null $user
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getMapMessages(?User $user): array;
}
