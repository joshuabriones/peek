<?php

namespace App\Services;

use App\Contracts\MessageRepositoryInterface;
use App\Contracts\MessageServiceInterface;
use App\Models\Message;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class MessageService implements MessageServiceInterface
{
    public function __construct(
        private MessageRepositoryInterface $messageRepository
    ) {}

    /**
     * Create a new message
     *
     * @param User $user
     * @param array $data
     * @return array
     */
    public function createMessage(User $user, array $data): array
    {
        try {
            // Business rule: Check daily message limit
            if (!$user->canPostMessageToday()) {
                return [
                    'success' => false,
                    'message' => 'Daily message limit reached',
                    'data' => ['remaining' => 0],
                    'status' => 429,
                ];
            }

            // Create message
            $message = $this->messageRepository->create($user->id, $data);

            return [
                'success' => true,
                'message' => null,
                'data' => [
                    'message' => $message,
                    'remaining' => $user->messagesTodayRemaining(),
                ],
                'status' => 201,
            ];
        } catch (Exception $e) {
            Log::error('Error creating message', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while creating the message',
                'data' => null,
                'status' => 500,
            ];
        }
    }

    /**
     * Mark a message as read by a user
     *
     * @param User $user
     * @param Message $message
     * @return array
     */
    public function markAsRead(User $user, Message $message): array
    {
        try {
            // Business rule: Can't read own message
            if ($user->id === $message->user_id) {
                return [
                    'success' => false,
                    'message' => 'Cannot read own message',
                    'data' => null,
                    'status' => 422,
                ];
            }

            // Mark as read
            $isNewRead = $this->messageRepository->markAsRead($user->id, $message->id);

            // Only increment if this is a new read
            if ($isNewRead) {
                $this->messageRepository->incrementReadCount($message->id);
            }

            // Check and handle profile unlock
            $this->checkAndUnlockProfile($user->id, $message->user_id);

            // Get updated read count
            $message->refresh();

            return [
                'success' => true,
                'message' => null,
                'data' => [
                    'profileUnlocked' => $this->messageRepository->hasUnlockedProfile($user->id, $message->user_id),
                    'newReadCount' => $message->read_count,
                ],
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error marking message as read', [
                'user_id' => $user->id,
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while marking message as read',
                'data' => null,
                'status' => 500,
            ];
        }
    }

    /**
     * Check and unlock profile if conditions are met
     *
     * @param int $userId
     * @param int $creatorId
     * @return void
     */
    private function checkAndUnlockProfile(int $userId, int $creatorId): void
    {
        // Business rule: Can't unlock own profile
        if ($userId === $creatorId) {
            return;
        }

        // Business rule: Unlock profile if user has read 2+ messages from creator
        $readCount = $this->messageRepository->getReadCountByUser($userId, $creatorId);

        if ($readCount >= 2) {
            $this->messageRepository->unlockProfile($userId, $creatorId);
        }
    }

    /**
     * Get all messages for today
     *
     * @return array
     */
    public function getTodayMessages(): array
    {
        try {
            $messages = $this->messageRepository->getTodayMessages();

            $data = $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'latitude' => $message->latitude,
                    'longitude' => $message->longitude,
                    'read_count' => $message->read_count,
                    'tag' => $message->tag,
                    'created_at' => $message->created_at,
                    'user' => [
                        'id' => $message->user->id,
                        'nickname' => $message->user->nickname ?: 'Anonymous',
                    ],
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting today messages', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => [],
                'status' => 500,
            ];
        }
    }

    /**
     * Get top messages for today
     *
     * @param int $limit
     * @return array
     */
    public function getTopMessagesToday(int $limit = 10): array
    {
        try {
            $messages = $this->messageRepository->getTopMessagesToday($limit);

            $data = $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'latitude' => $message->latitude,
                    'longitude' => $message->longitude,
                    'read_count' => $message->read_count,
                    'tag' => $message->tag,
                    'created_at' => $message->created_at,
                    'user' => [
                        'id' => $message->user->id,
                        'nickname' => $message->user->nickname ?: 'Anonymous',
                    ],
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting top messages today', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => [],
                'status' => 500,
            ];
        }
    }

    /**
     * Get remaining messages count for user today
     *
     * @param User $user
     * @return array
     */
    public function getRemainingMessages(User $user): array
    {
        try {
            return [
                'success' => true,
                'data' => [
                    'remaining' => $user->messagesTodayRemaining(),
                ],
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting remaining messages', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => ['remaining' => 0],
                'status' => 500,
            ];
        }
    }

    /**
     * Get user's messages for today
     *
     * @param User $user
     * @return array
     */
    public function getMyMessagesToday(User $user): array
    {
        try {
            $messages = $this->messageRepository->getUserMessagesToday($user->id);

            $data = $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'latitude' => $message->latitude,
                    'longitude' => $message->longitude,
                    'readCount' => $message->reads_count,
                    'createdAt' => $message->created_at->format('g:i A'),
                    'createdAtFull' => $message->created_at->toISOString(),
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting my messages today', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => [],
                'status' => 500,
            ];
        }
    }

    /**
     * Get messages for map view
     *
     * @param User|null $user
     * @return array
     */
    public function getMapMessages(?User $user): array
    {
        try {
            $messages = $this->messageRepository->getTodayMessages();
            $threshold = $this->messageRepository->getTopMessageThreshold();

            $data = $messages->map(function ($message) use ($user, $threshold) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'latitude' => $message->latitude,
                    'longitude' => $message->longitude,
                    'readCount' => $message->read_count,
                    'user' => [
                        'id' => $message->user->id,
                        'nickname' => $message->user->nickname ?: 'Anonymous',
                    ],
                    'user_id' => $message->user_id,
                    'userHasRead' => $user ? $this->messageRepository->hasUserReadMessage($user->id, $message->id) : false,
                    'isTopMessage' => $message->read_count >= $threshold,
                    'created_at' => $message->created_at,
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting map messages', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => [],
                'status' => 500,
            ];
        }
    }
}
