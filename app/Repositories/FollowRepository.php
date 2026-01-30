<?php

namespace App\Repositories;

use App\Contracts\FollowRepositoryInterface;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Collection;

class FollowRepository implements FollowRepositoryInterface
{
    /**
     * Create a follow relationship
     *
     * @param int $followerId
     * @param int $followingId
     * @return Follow
     */
    public function create(int $followerId, int $followingId): Follow
    {
        return Follow::create([
            'follower_id' => $followerId,
            'following_id' => $followingId,
        ]);
    }

    /**
     * Delete a follow relationship
     *
     * @param int $followerId
     * @param int $followingId
     * @return bool
     */
    public function delete(int $followerId, int $followingId): bool
    {
        return Follow::where('follower_id', $followerId)
            ->where('following_id', $followingId)
            ->delete() > 0;
    }

    /**
     * Check if user is following another user
     *
     * @param int $followerId
     * @param int $followingId
     * @return bool
     */
    public function isFollowing(int $followerId, int $followingId): bool
    {
        return Follow::where('follower_id', $followerId)
            ->where('following_id', $followingId)
            ->exists();
    }

    /**
     * Check if user is followed by another user
     *
     * @param int $userId
     * @param int $followerId
     * @return bool
     */
    public function isFollowedBy(int $userId, int $followerId): bool
    {
        return $this->isFollowing($followerId, $userId);
    }

    /**
     * Check if mutual follow exists between two users
     *
     * @param int $userId1
     * @param int $userId2
     * @return bool
     */
    public function isMutualFollow(int $userId1, int $userId2): bool
    {
        return $this->isFollowing($userId1, $userId2) && $this->isFollowing($userId2, $userId1);
    }

    /**
     * Get all followers of a user
     *
     * @param int $userId
     * @return Collection
     */
    public function getFollowers(int $userId): Collection
    {
        return Follow::where('following_id', $userId)
            ->with('follower:id,name,nickname,bio')
            ->get()
            ->pluck('follower');
    }

    /**
     * Get all users that a user is following
     *
     * @param int $userId
     * @return Collection
     */
    public function getFollowing(int $userId): Collection
    {
        return Follow::where('follower_id', $userId)
            ->with('following:id,name,nickname,bio')
            ->get()
            ->pluck('following');
    }

    /**
     * Count followers of a user
     *
     * @param int $userId
     * @return int
     */
    public function countFollowers(int $userId): int
    {
        return Follow::where('following_id', $userId)->count();
    }

    /**
     * Count users that a user is following
     *
     * @param int $userId
     * @return int
     */
    public function countFollowing(int $userId): int
    {
        return Follow::where('follower_id', $userId)->count();
    }
}
