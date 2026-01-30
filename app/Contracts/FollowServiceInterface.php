<?php

namespace App\Contracts;

use App\Models\User;

interface FollowServiceInterface
{
    /**
     * Follow a user
     *
     * @param User $follower
     * @param User $following
     * @return array ['success' => bool, 'message' => string, 'data' => array|null, 'status' => int]
     */
    public function follow(User $follower, User $following): array;

    /**
     * Unfollow a user
     *
     * @param User $follower
     * @param User $following
     * @return array ['success' => bool, 'message' => string, 'data' => array|null, 'status' => int]
     */
    public function unfollow(User $follower, User $following): array;

    /**
     * Get follow status between two users
     *
     * @param User $follower
     * @param User $following
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getFollowStatus(User $follower, User $following): array;

    /**
     * Get followers of a user
     *
     * @param User $user
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getFollowers(User $user): array;

    /**
     * Get users that a user is following
     *
     * @param User $user
     * @return array ['success' => bool, 'data' => array, 'status' => int]
     */
    public function getFollowing(User $user): array;
}
