<?php

namespace App\Contracts;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Collection;

interface FollowRepositoryInterface
{
    /**
     * Create a follow relationship
     *
     * @param int $followerId
     * @param int $followingId
     * @return Follow
     */
    public function create(int $followerId, int $followingId): Follow;

    /**
     * Delete a follow relationship
     *
     * @param int $followerId
     * @param int $followingId
     * @return bool
     */
    public function delete(int $followerId, int $followingId): bool;

    /**
     * Check if user is following another user
     *
     * @param int $followerId
     * @param int $followingId
     * @return bool
     */
    public function isFollowing(int $followerId, int $followingId): bool;

    /**
     * Check if user is followed by another user
     *
     * @param int $userId
     * @param int $followerId
     * @return bool
     */
    public function isFollowedBy(int $userId, int $followerId): bool;

    /**
     * Check if mutual follow exists between two users
     *
     * @param int $userId1
     * @param int $userId2
     * @return bool
     */
    public function isMutualFollow(int $userId1, int $userId2): bool;

    /**
     * Get all followers of a user
     *
     * @param int $userId
     * @return Collection
     */
    public function getFollowers(int $userId): Collection;

    /**
     * Get all users that a user is following
     *
     * @param int $userId
     * @return Collection
     */
    public function getFollowing(int $userId): Collection;

    /**
     * Count followers of a user
     *
     * @param int $userId
     * @return int
     */
    public function countFollowers(int $userId): int;

    /**
     * Count users that a user is following
     *
     * @param int $userId
     * @return int
     */
    public function countFollowing(int $userId): int;
}
