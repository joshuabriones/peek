<?php

namespace App\Services;

use App\Contracts\FollowRepositoryInterface;
use App\Contracts\FollowServiceInterface;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class FollowService implements FollowServiceInterface
{
    public function __construct(
        private FollowRepositoryInterface $followRepository
    ) {}

    /**
     * Follow a user
     *
     * @param User $follower
     * @param User $following
     * @return array
     */
    public function follow(User $follower, User $following): array
    {
        try {
            // Business rule: Can't follow yourself
            if ($follower->id === $following->id) {
                return [
                    'success' => false,
                    'message' => 'You cannot follow yourself',
                    'data' => null,
                    'status' => 422,
                ];
            }

            // Business rule: Check if already following
            if ($this->followRepository->isFollowing($follower->id, $following->id)) {
                return [
                    'success' => false,
                    'message' => 'Already following this user',
                    'data' => null,
                    'status' => 422,
                ];
            }

            // Create follow relationship
            $this->followRepository->create($follower->id, $following->id);

            // Check if mutual follow exists now
            $isMutual = $this->followRepository->isMutualFollow($follower->id, $following->id);

            return [
                'success' => true,
                'message' => 'User followed successfully',
                'data' => [
                    'is_following' => true,
                    'is_mutual' => $isMutual,
                ],
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error following user', [
                'follower_id' => $follower->id,
                'following_id' => $following->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while following the user',
                'data' => null,
                'status' => 500,
            ];
        }
    }

    /**
     * Unfollow a user
     *
     * @param User $follower
     * @param User $following
     * @return array
     */
    public function unfollow(User $follower, User $following): array
    {
        try {
            $this->followRepository->delete($follower->id, $following->id);

            return [
                'success' => true,
                'message' => 'User unfollowed successfully',
                'data' => [
                    'is_following' => false,
                    'is_mutual' => false,
                ],
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error unfollowing user', [
                'follower_id' => $follower->id,
                'following_id' => $following->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred while unfollowing the user',
                'data' => null,
                'status' => 500,
            ];
        }
    }

    /**
     * Get follow status between two users
     *
     * @param User $follower
     * @param User $following
     * @return array
     */
    public function getFollowStatus(User $follower, User $following): array
    {
        try {
            $isFollowing = $this->followRepository->isFollowing($follower->id, $following->id);
            $isFollowedBy = $this->followRepository->isFollowedBy($follower->id, $following->id);
            $isMutual = $isFollowing && $isFollowedBy;

            return [
                'success' => true,
                'data' => [
                    'is_following' => $isFollowing,
                    'is_followed_by' => $isFollowedBy,
                    'is_mutual' => $isMutual,
                    'followers_count' => $this->followRepository->countFollowers($following->id),
                    'following_count' => $this->followRepository->countFollowing($following->id),
                ],
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting follow status', [
                'follower_id' => $follower->id,
                'following_id' => $following->id,
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
     * Get followers of a user
     *
     * @param User $user
     * @return array
     */
    public function getFollowers(User $user): array
    {
        try {
            $followers = $this->followRepository->getFollowers($user->id);

            $data = $followers->map(function ($follower) use ($user) {
                return [
                    'id' => $follower->id,
                    'name' => $follower->name,
                    'nickname' => $follower->nickname,
                    'bio' => $follower->bio,
                    'is_mutual' => $this->followRepository->isMutualFollow($user->id, $follower->id),
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting followers', [
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
     * Get users that a user is following
     *
     * @param User $user
     * @return array
     */
    public function getFollowing(User $user): array
    {
        try {
            $following = $this->followRepository->getFollowing($user->id);

            $data = $following->map(function ($followingUser) use ($user) {
                return [
                    'id' => $followingUser->id,
                    'name' => $followingUser->name,
                    'nickname' => $followingUser->nickname,
                    'bio' => $followingUser->bio,
                    'is_mutual' => $this->followRepository->isMutualFollow($user->id, $followingUser->id),
                ];
            })->toArray();

            return [
                'success' => true,
                'data' => $data,
                'status' => 200,
            ];
        } catch (Exception $e) {
            Log::error('Error getting following', [
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
}
